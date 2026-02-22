import React, { useState } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  IconButton,
  TextField,
  LinearProgress,
  Tooltip,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import type { Subtask } from '../../types/task';

interface TaskChecklistProps {
  subtasks: Subtask[];
  onChange: (updated: Subtask[]) => void;
  /** Em modo compacto, oculta o campo de adicionar subtarefa */
  compact?: boolean;
}

/**
 * Checklist inteligente de subtarefas.
 * Exibe aviso se a tarefa tiver mais de 5 subtarefas (sobrecarga cognitiva).
 */
export const TaskChecklist: React.FC<TaskChecklistProps> = ({
  subtasks,
  onChange,
  compact = false,
}) => {
  const [newTitle, setNewTitle] = useState('');

  const completed = subtasks.filter((s) => s.completed).length;
  const progress = subtasks.length > 0 ? (completed / subtasks.length) * 100 : 0;

  const toggle = (id: string) => {
    onChange(subtasks.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s)));
  };

  const remove = (id: string) => {
    onChange(subtasks.filter((s) => s.id !== id));
  };

  const add = () => {
    const title = newTitle.trim();
    if (!title) return;
    const newSubtask: Subtask = {
      id: `subtask-${Date.now()}`,
      title,
      completed: false,
    };
    onChange([...subtasks, newSubtask]);
    setNewTitle('');
  };

  return (
    <Box>
      {/* Progresso */}
      {subtasks.length > 0 && (
        <Box sx={{ mb: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Progresso
            </Typography>
            <Typography variant="caption" fontWeight={700} color="primary.main">
              {completed}/{subtasks.length}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ borderRadius: 4, height: 6 }}
          />
        </Box>
      )}

      {/* Aviso de sobrecarga cognitiva */}
      {subtasks.length > 5 && (
        <Alert severity="warning" sx={{ mb: 1.5, py: 0.5, fontSize: '0.78rem' }}>
          Esta tarefa tem muitas etapas. Considere dividi-la em tarefas menores.
        </Alert>
      )}

      {/* Lista */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
        {subtasks.map((sub) => (
          <Box
            key={sub.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              borderRadius: 1,
              px: 0.5,
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Checkbox
              size="small"
              checked={sub.completed}
              onChange={() => toggle(sub.id)}
              sx={{ p: 0.5 }}
            />
            <Typography
              variant="body2"
              sx={{
                flex: 1,
                textDecoration: sub.completed ? 'line-through' : 'none',
                color: sub.completed ? 'text.disabled' : 'text.primary',
                fontSize: '0.82rem',
              }}
            >
              {sub.title}
            </Typography>
            {!compact && (
              <Tooltip title="Remover">
                <IconButton size="small" onClick={() => remove(sub.id)} sx={{ opacity: 0.5, '&:hover': { opacity: 1 } }}>
                  <DeleteOutlineIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        ))}
      </Box>

      {/* Adicionar */}
      {!compact && (
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <TextField
            size="small"
            placeholder="Nova etapa…"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
            sx={{ flex: 1, '& input': { fontSize: '0.82rem' } }}
          />
          <IconButton size="small" color="primary" onClick={add} disabled={!newTitle.trim()}>
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};
