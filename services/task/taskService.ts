import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Task, TaskStatus, PomodoroSession, Subtask } from '../../types/task';
import { tasksMock } from './taskMock';

const USE_MOCK = false;

// ─── Tasks ────────────────────────────────────────────────────────────────────

export const getUserTasks = async (userId: string): Promise<Task[]> => {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    return tasksMock.map((t) => ({ ...t, userId }));
  }

  const q = query(
    collection(db, 'tasks'),
    where('userId', '==', userId),
  );
  const snap = await getDocs(q);
  const tasks = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Task));

  // Ordenação client-side — evita índice composto no Firestore
  const statusOrder: Record<string, number> = { todo: 0, doing: 1, done: 2 };
  return tasks.sort((a, b) => {
    const statusDiff = (statusOrder[a.status] ?? 0) - (statusOrder[b.status] ?? 0);
    return statusDiff !== 0 ? statusDiff : (a.order ?? 0) - (b.order ?? 0);
  });
};

export const createTask = async (
  userId: string,
  task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'completedPomodoros'>,
): Promise<Task> => {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    return {
      ...task,
      id: `mock-${Date.now()}`,
      userId,
      completedPomodoros: 0,
      createdAt: new Date(),
    };
  }

  const ref = await addDoc(collection(db, 'tasks'), {
    ...task,
    userId,
    completedPomodoros: 0,
    createdAt: serverTimestamp(),
  });

  return {
    ...task,
    id: ref.id,
    userId,
    completedPomodoros: 0,
    createdAt: new Date(),
  };
};

export const updateTask = async (
  taskId: string,
  updates: Partial<Omit<Task, 'id' | 'userId' | 'createdAt'>>,
): Promise<void> => {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    return;
  }
  await updateDoc(doc(db, 'tasks', taskId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const deleteTask = async (taskId: string): Promise<void> => {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    return;
  }
  await deleteDoc(doc(db, 'tasks', taskId));
};

export const moveTask = async (
  taskId: string,
  newStatus: TaskStatus,
  newOrder: number,
): Promise<void> => {
  if (USE_MOCK) return;
  await updateDoc(doc(db, 'tasks', taskId), {
    status: newStatus,
    order: newOrder,
    updatedAt: serverTimestamp(),
  });
};

/** Atualiza a ordem de múltiplas tarefas em batch */
export const reorderTasks = async (tasks: { id: string; order: number }[]): Promise<void> => {
  if (USE_MOCK) return;
  const batch = writeBatch(db);
  tasks.forEach(({ id, order }) => {
    batch.update(doc(db, 'tasks', id), { order });
  });
  await batch.commit();
};

/** Incrementa contador de pomodoros completados */
export const incrementPomodoro = async (taskId: string, current: number): Promise<void> => {
  if (USE_MOCK) return;
  await updateDoc(doc(db, 'tasks', taskId), {
    completedPomodoros: current + 1,
    updatedAt: serverTimestamp(),
  });
};

/** Atualiza subtarefas de uma task */
export const updateSubtasks = async (taskId: string, subtasks: Subtask[]): Promise<void> => {
  if (USE_MOCK) return;
  await updateDoc(doc(db, 'tasks', taskId), {
    subtasks,
    updatedAt: serverTimestamp(),
  });
};

// ─── Pomodoro Sessions ────────────────────────────────────────────────────────

export const startPomodoroSession = async (
  userId: string,
  taskId: string,
  type: PomodoroSession['type'] = 'focus',
): Promise<string> => {
  if (USE_MOCK) return `mock-session-${Date.now()}`;

  const ref = await addDoc(collection(db, 'pomodoroSessions'), {
    userId,
    taskId,
    type,
    startTime: serverTimestamp(),
    completed: false,
    duration: 0,
  });
  return ref.id;
};

export const completePomodoroSession = async (
  sessionId: string,
  duration: number,
): Promise<void> => {
  if (USE_MOCK) return;
  await updateDoc(doc(db, 'pomodoroSessions', sessionId), {
    endTime: serverTimestamp(),
    duration,
    completed: true,
  });
};

export const getUserPomodoros = async (userId: string): Promise<PomodoroSession[]> => {
  if (USE_MOCK) return [];
  const q = query(
    collection(db, 'pomodoroSessions'),
    where('userId', '==', userId),
  );
  const snap = await getDocs(q);
  const sessions = snap.docs.map((d) => ({ id: d.id, ...d.data() } as PomodoroSession));

  // Ordenação client-side por startTime desc — evita índice composto
  return sessions.sort((a, b) => {
    const tA = a.startTime instanceof Date ? a.startTime.getTime() : (a.startTime as any)?.toMillis?.() ?? 0;
    const tB = b.startTime instanceof Date ? b.startTime.getTime() : (b.startTime as any)?.toMillis?.() ?? 0;
    return tB - tA;
  });
};
