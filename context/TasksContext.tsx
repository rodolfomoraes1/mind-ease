import React, { createContext, useContext } from 'react';
import { useTasks } from '../hooks/useTasks';
import type { Task, TaskStatus, Subtask } from '../types/task';

interface UseTasksResult {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTask: (task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'completedPomodoros'>) => Promise<void>;
  moveTaskTo: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  editTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  removeTask: (taskId: string) => Promise<void>;
  addCompletedPomodoro: (taskId: string) => Promise<void>;
  setSubtasks: (taskId: string, subtasks: Subtask[]) => Promise<void>;
  refetch: () => void;
}

const TasksContext = createContext<UseTasksResult | null>(null);

/**
 * Provider que expõe uma única instância do useTasks para toda a árvore.
 * Evita que TaskOrganizer e TaskBoard tenham estados separados de tasks.
 */
export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useTasks();
  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
};

/**
 * Hook para consumir o estado compartilhado de tasks.
 * Deve ser usado dentro de TasksProvider.
 */
export const useTasksContext = (): UseTasksResult => {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasksContext deve ser usado dentro de TasksProvider');
  return ctx;
};
