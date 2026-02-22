import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Chip,
  Stack,
  Divider,
  CircularProgress,
} from '@mui/material';
import type { Task, CognitiveLoad, TaskStatus } from '../../types/task';
import { COGNITIVE_LOAD_COLORS, COGNITIVE_LOAD_LABELS } from '../../types/task';
import { TaskChecklist } from './TaskChecklist';

const DEFAULT_TAGS = ['estudo', 'trabalho', 'projeto', 'pesquisa', 'revisão', 'dev'];

type TaskFormData = {
  title: string;
  description: string;
  cognitiveLoad: CognitiveLoad;
  estimatedPomodoros: number;
  tags: string[];
  subtasks: Task['subtasks'];
  status: TaskStatus;
};

const defaultForm: TaskFormData = {
  title: '',
  description: '',
  cognitiveLoad: 'medium',
  estimatedPomodoros: 2,
  tags: [],
  subtasks: [],
  status: 'todo',
};

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
  initialData?: Partial<Task>;
  mode?: 'create' | 'edit';
}

/**
 * Modal de criação e edição de tarefas.
 */
export const TaskModal: React.FC<TaskModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  mode = 'create',
}) => {
  const [form, setForm] = useState<TaskFormData>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (open) {
      setForm(
        initialData
          ? {
              title: initialData.title ?? '',
              description: initialData.description ?? '',
              cognitiveLoad: initialData.cognitiveLoad ?? 'medium',
              estimatedPomodoros: initialData.estimatedPomodoros ?? 2,
              tags: initialData.tags ?? [],
              subtasks: initialData.subtasks ?? [],
              status: initialData.status ?? 'todo',
            }
          : defaultForm,
      );
    }
  }, [open, initialData]);

  const set = <K extends keyof TaskFormData>(key: K, value: TaskFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const addTag = (tag: string) => {
    const t = tag.trim().toLowerCase();
    if (!t || form.tags.includes(t)) return;
    set('tags', [...form.tags, t]);
    setTagInput('');
  };

  const removeTag = (tag: string) => set('tags', form.tags.filter((t) => t !== tag));

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
        {mode === 'create' ? '➕ Nova tarefa' : '✏️ Editar tarefa'}
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={2.5}>
          {/* Título */}
          <TextField
            label="Título *"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            fullWidth
            autoFocus
            placeholder="O que precisa ser feito?"
          />

          {/* Descrição */}
          <TextField
            label="Descrição"
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            fullWidth
            multiline
            rows={2}
            placeholder="Contexto adicional (opcional)"
          />

          {/* Carga cognitiva */}
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Carga cognitiva
            </Typography>
            <ToggleButtonGroup
              value={form.cognitiveLoad}
              exclusive
              onChange={(_, val) => val && set('cognitiveLoad', val)}
              size="small"
            >
              {(['low', 'medium', 'high'] as CognitiveLoad[]).map((level) => (
                <ToggleButton
                  key={level}
                  value={level}
                  sx={{
                    px: 2,
                    '&.Mui-selected': {
                      bgcolor: `${COGNITIVE_LOAD_COLORS[level]}22`,
                      color: COGNITIVE_LOAD_COLORS[level],
                      borderColor: COGNITIVE_LOAD_COLORS[level],
                      fontWeight: 700,
                    },
                  }}
                >
                  {COGNITIVE_LOAD_LABELS[level]}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          {/* Pomodoros estimados */}
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Pomodoros estimados
            </Typography>
            <ToggleButtonGroup
              value={form.estimatedPomodoros}
              exclusive
              onChange={(_, val) => val && set('estimatedPomodoros', val)}
              size="small"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <ToggleButton key={n} value={n} sx={{ minWidth: 36 }}>
                  {n}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              ≈ {form.estimatedPomodoros * 25} min
            </Typography>
          </Box>

          {/* Tags */}
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Tags
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1 }}>
              {DEFAULT_TAGS.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  clickable
                  onClick={() => (form.tags.includes(tag) ? removeTag(tag) : addTag(tag))}
                  color={form.tags.includes(tag) ? 'primary' : 'default'}
                  variant={form.tags.includes(tag) ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                placeholder="Tag personalizada…"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput); }
                }}
                sx={{ flex: 1 }}
              />
              <Button size="small" variant="outlined" onClick={() => addTag(tagInput)}>
                +
              </Button>
            </Box>
          </Box>

          {/* Subtarefas */}
          <Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Etapas / Subtarefas
            </Typography>
            <TaskChecklist
              subtasks={form.subtasks}
              onChange={(updated) => set('subtasks', updated)}
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onClose} disabled={saving} color="inherit">
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!form.title.trim() || saving}
          startIcon={saving ? <CircularProgress size={14} color="inherit" /> : undefined}
        >
          {saving ? 'Salvando…' : mode === 'create' ? 'Criar tarefa' : 'Salvar alterações'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
