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

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

function cacheKey(uid: string) {
  return `mind-ease:tasks:${uid}`;
}

function loadFromCache(uid: string): Task[] | null {
  try {
    const raw = localStorage.getItem(cacheKey(uid));
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw) as { data: Task[]; timestamp: number };
    if (Date.now() - timestamp > CACHE_TTL_MS) return null;
    return (data as Task[]).map((t) => ({
      ...t,
      createdAt: t.createdAt ? new Date(t.createdAt as unknown as string) : t.createdAt,
    }));
  } catch {
    return null;
  }
}

function saveToCache(uid: string, tasks: Task[]) {
  try {
    localStorage.setItem(cacheKey(uid), JSON.stringify({ data: tasks, timestamp: Date.now() }));
  } catch {
    // NOOP
  }
}

function clearCache(uid: string) {
  try {
    localStorage.removeItem(cacheKey(uid));
  } catch {
    // NOOP
  }
}

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

    const cached = loadFromCache(user.uid);
    if (cached) setTasks(cached);

    setLoading(true);
    setError(null);

    getUserTasks(user.uid)
      .then((data) => {
        if (!cancelled) {
          setTasks(data);
          saveToCache(user.uid, data);
        }
      })
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
      setTasks((prev) => {
        const next = [...prev, optimistic];
        saveToCache(user.uid, next);
        return next;
      });
      try {
        const created = await createTask(user.uid, task);
        setTasks((prev) => {
          const next = prev.map((t) => (t.id === optimistic.id ? created : t));
          saveToCache(user.uid, next);
          return next;
        });
      } catch {
        setTasks((prev) => {
          const next = prev.filter((t) => t.id !== optimistic.id);
          saveToCache(user.uid, next);
          return next;
        });
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
      setTasks((prev) => {
        const next = prev.filter((t) => t.id !== taskId);
        if (user) saveToCache(user.uid, next);
        return next;
      });
      try {
        await deleteTask(taskId);
      } catch {
        setTasks(snapshot);
        if (user) saveToCache(user.uid, snapshot);
        throw new Error('Erro ao remover tarefa.');
      }
    },
    [tasks, user],
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
