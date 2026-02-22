import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import {
  getUserTasks,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
  reorderTasks,
  incrementPomodoro,
  updateSubtasks,
} from '../services/task';
import type { Task, TaskStatus, Subtask } from '../types/task';

interface UseTasksResult {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  /** Adiciona nova tarefa com optimistic update */
  addTask: (task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'completedPomodoros'>) => Promise<void>;
  /** Move tarefa para nova coluna */
  moveTaskTo: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  /** Atualiza campos de uma tarefa */
  editTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  /** Remove tarefa */
  removeTask: (taskId: string) => Promise<void>;
  /** Incrementa pomodoro completado */
  addCompletedPomodoro: (taskId: string) => Promise<void>;
  /** Atualiza lista de subtarefas */
  setSubtasks: (taskId: string, subtasks: Subtask[]) => Promise<void>;
  refetch: () => void;
}

export function useTasks(): UseTasksResult {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchCount, setFetchCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    getUserTasks(user.uid)
      .then((data) => { if (!cancelled) setTasks(data); })
      .catch(() => { if (!cancelled) setError('Não foi possível carregar as tarefas.'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [user, fetchCount]);

  const refetch = useCallback(() => setFetchCount((c) => c + 1), []);

  const addTask = useCallback(
    async (task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'completedPomodoros'>) => {
      if (!user) return;
      const optimistic: Task = {
        ...task,
        id: `optimistic-${Date.now()}`,
        userId: user.uid,
        completedPomodoros: 0,
        createdAt: new Date(),
        order: tasks.filter((t) => t.status === task.status).length,
      };
      setTasks((prev) => [...prev, optimistic]);
      try {
        const created = await createTask(user.uid, task);
        setTasks((prev) => prev.map((t) => (t.id === optimistic.id ? created : t)));
      } catch {
        setTasks((prev) => prev.filter((t) => t.id !== optimistic.id));
        throw new Error('Erro ao criar tarefa.');
      }
    },
    [user, tasks],
  );

  const moveTaskTo = useCallback(
    async (taskId: string, newStatus: TaskStatus) => {
      const newOrder = tasks.filter((t) => t.status === newStatus).length;
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus, order: newOrder } : t)),
      );
      try {
        await moveTask(taskId, newStatus, newOrder);
      } catch {
        refetch();
      }
    },
    [tasks, refetch],
  );

  const editTask = useCallback(
    async (taskId: string, updates: Partial<Task>) => {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t)));
      try {
        await updateTask(taskId, updates);
      } catch {
        refetch();
        throw new Error('Erro ao atualizar tarefa.');
      }
    },
    [refetch],
  );

  const removeTask = useCallback(
    async (taskId: string) => {
      const snapshot = tasks;
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      try {
        await deleteTask(taskId);
      } catch {
        setTasks(snapshot);
        throw new Error('Erro ao remover tarefa.');
      }
    },
    [tasks],
  );

  const addCompletedPomodoro = useCallback(
    async (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;
      const next = task.completedPomodoros + 1;
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completedPomodoros: next } : t)),
      );
      try {
        await incrementPomodoro(taskId, task.completedPomodoros);
      } catch {
        refetch();
      }
    },
    [tasks, refetch],
  );

  const setSubtasks = useCallback(
    async (taskId: string, subtasks: Subtask[]) => {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, subtasks } : t)));
      try {
        await updateSubtasks(taskId, subtasks);
      } catch {
        refetch();
      }
    },
    [refetch],
  );

  return {
    tasks,
    loading,
    error,
    addTask,
    moveTaskTo,
    editTask,
    removeTask,
    addCompletedPomodoro,
    setSubtasks,
    refetch,
  };
}
