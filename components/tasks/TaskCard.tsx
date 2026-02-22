import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  Menu,
  MenuItem,
  LinearProgress,
  Collapse,
  Tooltip,
  Stack,
  Divider,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import type { Task, TaskStatus } from '../../types/task';
import { COGNITIVE_LOAD_COLORS, COGNITIVE_LOAD_LABELS } from '../../types/task';
import { useSummaryMode } from '../dashboard/SummaryModeWrapper';
import { TaskChecklist } from './TaskChecklist';

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: '📋 A Fazer',
  doing: '⚡ Em andamento',
  done: '✅ Concluído',
};

const MOVE_OPTIONS: { label: string; status: TaskStatus }[] = [
  { label: '📋 Mover para A Fazer', status: 'todo' },
  { label: '⚡ Mover para Em andamento', status: 'doing' },
  { label: '✅ Mover para Concluído', status: 'done' },
];

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMove?: (id: string, status: TaskStatus) => void;
  onSubtasksChange?: (id: string, subtasks: Task['subtasks']) => void;
  /** Callback para iniciar Pomodoro nessa tarefa */
  onStartPomodoro?: (task: Task) => void;
  dragging?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onMove,
  onSubtasksChange,
  onStartPomodoro,
  dragging = false,
}) => {
  const { isSummaryMode: summaryMode } = useSummaryMode();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [expanded, setExpanded] = useState(false);

  const loadColor = COGNITIVE_LOAD_COLORS[task.cognitiveLoad];
  const pomodoroProgress = task.estimatedPomodoros > 0
    ? Math.min((task.completedPomodoros / task.estimatedPomodoros) * 100, 100)
    : 0;
  const hasSubtasks = task.subtasks.length > 0;
  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;

  return (
    <Card
      elevation={dragging ? 8 : 1}
      sx={{
        position: 'relative',
        borderLeft: `4px solid ${loadColor}`,
        borderRadius: 2,
        cursor: dragging ? 'grabbing' : 'grab',
        transition: 'box-shadow 0.2s, transform 0.15s',
        transform: dragging ? 'rotate(2deg) scale(1.02)' : 'none',
        '&:hover': { boxShadow: 4 },
        opacity: task.status === 'done' ? 0.75 : 1,
      }}
    >
      {/* Indicador de carga cognitiva no topo */}
      <LinearProgress
        variant="determinate"
        value={pomodoroProgress}
        sx={{
          height: 3,
          borderRadius: 0,
          bgcolor: 'action.hover',
          '& .MuiLinearProgress-bar': { bgcolor: loadColor },
        }}
      />

      <CardContent sx={{ pt: 1.5, pb: '12px !important', px: 2 }}>
        {/* Header: título + menu */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
          <Typography
            variant="body1"
            sx={{
              flex: 1,
              fontWeight: 600,
              lineHeight: 1.3,
              textDecoration: task.status === 'done' ? 'line-through' : 'none',
              color: task.status === 'done' ? 'text.secondary' : 'text.primary',
              wordBreak: 'break-word',
            }}
          >
            {task.title}
          </Typography>
          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); setMenuAnchor(e.currentTarget); }}
            sx={{ mt: -0.5, mr: -0.5, flexShrink: 0 }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Descrição (oculta no modo resumo) */}
        {!summaryMode && task.description && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mt: 0.5,
            }}
          >
            {task.description}
          </Typography>
        )}

        {/* Tags */}
        {task.tags.length > 0 && !summaryMode && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
            {task.tags.slice(0, 3).map((tag) => (
              <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ height: 18, fontSize: '0.65rem' }} />
            ))}
            {task.tags.length > 3 && (
              <Chip label={`+${task.tags.length - 3}`} size="small" sx={{ height: 18, fontSize: '0.65rem' }} />
            )}
          </Box>
        )}

        {/* Footer: carga cognitiva + pomodoros */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5 }}>
          <Chip
            label={COGNITIVE_LOAD_LABELS[task.cognitiveLoad]}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.65rem',
              bgcolor: `${loadColor}22`,
              color: loadColor,
              fontWeight: 600,
              border: `1px solid ${loadColor}55`,
            }}
          />

          <Stack direction="row" spacing={0.75} alignItems="center">
            <Tooltip title="Iniciar Pomodoro">
              <Chip
                icon={<TimerOutlinedIcon sx={{ fontSize: '0.8rem !important' }} />}
                label={`${task.completedPomodoros}/${task.estimatedPomodoros}`}
                size="small"
                clickable={!!onStartPomodoro}
                onClick={(e) => { e.stopPropagation(); onStartPomodoro?.(task); }}
                sx={{ height: 22, fontSize: '0.7rem', cursor: onStartPomodoro ? 'pointer' : 'default' }}
              />
            </Tooltip>

            {hasSubtasks && (
              <Chip
                label={`${completedSubtasks}/${task.subtasks.length}`}
                size="small"
                sx={{ height: 22, fontSize: '0.7rem' }}
              />
            )}

            {hasSubtasks && (
              <IconButton
                size="small"
                onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
                sx={{ p: 0.25 }}
              >
                {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
              </IconButton>
            )}
          </Stack>
        </Box>

        {/* Subtarefas expansível */}
        {hasSubtasks && (
          <Collapse in={expanded} timeout="auto">
            <Divider sx={{ my: 1 }} />
            <TaskChecklist
              compact
              subtasks={task.subtasks}
              onChange={(updated) => onSubtasksChange?.(task.id, updated)}
            />
          </Collapse>
        )}
      </CardContent>

      {/* Kebab Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        PaperProps={{ sx: { borderRadius: 2, minWidth: 180 } }}
      >
        <MenuItem onClick={() => { onEdit(task); setMenuAnchor(null); }}>
          ✏️ Editar
        </MenuItem>

        {onMove && (
          MOVE_OPTIONS.filter((opt) => opt.status !== task.status).map((opt) => (
            <MenuItem
              key={opt.status}
              onClick={() => { onMove(task.id, opt.status); setMenuAnchor(null); }}
            >
              {opt.label}
            </MenuItem>
          ))
        )}

        <Divider />
        <MenuItem
          onClick={() => { onDelete(task.id); setMenuAnchor(null); }}
          sx={{ color: 'error.main' }}
        >
          🗑️ Excluir
        </MenuItem>
      </Menu>
    </Card>
  );
};
