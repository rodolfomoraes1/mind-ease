import { Timestamp } from 'firebase/firestore';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export type TaskStatus = 'todo' | 'doing' | 'done';
export type CognitiveLoad = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  estimatedPomodoros: number;
  completedPomodoros: number;
  tags: string[];
  cognitiveLoad: CognitiveLoad;
  subtasks: Subtask[];
  createdAt: Timestamp | Date;
  dueDate?: Timestamp | Date;
  /** Posição na coluna para ordenação do Kanban */
  order: number;
}

export type TaskStatus_Value = Task['status'];

export interface PomodoroSession {
  id: string;
  userId: string;
  taskId: string;
  startTime: Timestamp | Date;
  endTime?: Timestamp | Date;
  /** Duração real em minutos */
  duration: number;
  completed: boolean;
  type: 'focus' | 'shortBreak' | 'longBreak';
}

/** Duração padrão de cada ciclo em minutos */
export const POMODORO_DURATIONS: Record<PomodoroSession['type'], number> = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
};

/** Cores por carga cognitiva */
export const COGNITIVE_LOAD_COLORS: Record<CognitiveLoad, string> = {
  low: '#4ECDC4',
  medium: '#FFD93D',
  high: '#FF6B6B',
};

export const COGNITIVE_LOAD_LABELS: Record<CognitiveLoad, string> = {
  low: 'Leve',
  medium: 'Moderada',
  high: 'Intensa',
};
