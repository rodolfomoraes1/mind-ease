import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  CircularProgress,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { usePomodoro } from '../../hooks/usePomodoro';

const PHASE_LABELS = {
  focus: '🧠 Foco',
  shortBreak: '☕ Pausa curta',
  longBreak: '🛌 Pausa longa',
};

const PHASE_COLORS = {
  focus: '#667EEA',
  shortBreak: '#48BB78',
  longBreak: '#4299E1',
};

interface PomodoroTimerProps {
  taskId: string;
  onPomodoroComplete?: () => void;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

/**
 * Timer Pomodoro com círculo de progresso SVG.
 * Ciclo automático: foco → pausa curta → foco → … → pausa longa.
 */
export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ taskId, onPomodoroComplete }) => {
  const {
    phase,
    secondsLeft,
    totalSeconds,
    isRunning,
    pomodoroCount,
    start,
    pause,
    reset,
    complete,
    progress,
  } = usePomodoro({ taskId, onPomodoroComplete });

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const color = PHASE_COLORS[phase];

  const SIZE = 120;
  const STROKE = 8;
  const RADIUS = (SIZE - STROKE) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const offset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;

  return (
    <Box
      id="tour-pomodoro"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.5,
        p: 2,
        borderRadius: 3,
        background: `${color}11`,
        border: `1.5px solid ${color}33`,
      }}
    >
      {/* Fase */}
      <Chip
        label={PHASE_LABELS[phase]}
        size="small"
        sx={{ bgcolor: `${color}22`, color, fontWeight: 700, fontSize: '0.75rem' }}
      />

      {/* Círculo de progresso */}
      <Box sx={{ position: 'relative', width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} style={{ transform: 'rotate(-90deg)' }}>
          {/* Trilha */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={`${color}22`}
            strokeWidth={STROKE}
          />
          {/* Progresso */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth={STROKE}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        {/* Tempo */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}
          >
            {pad(minutes)}:{pad(seconds)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            min
          </Typography>
        </Box>
      </Box>

      {/* Controles */}
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {isRunning ? (
          <Tooltip title="Pausar">
            <IconButton size="small" onClick={pause} sx={{ color }}>
              <PauseIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Iniciar">
            <IconButton size="small" onClick={start} sx={{ color }}>
              <PlayArrowIcon />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Resetar">
          <IconButton size="small" onClick={reset} sx={{ color: 'text.secondary' }}>
            <RestartAltIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Completar pomodoro">
          <IconButton size="small" onClick={complete} sx={{ color: 'success.main' }}>
            <CheckCircleOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Contador */}
      <Typography variant="caption" color="text.secondary">
        🍅 {pomodoroCount} pomodoro{pomodoroCount !== 1 ? 's' : ''} hoje
      </Typography>
    </Box>
  );
};
