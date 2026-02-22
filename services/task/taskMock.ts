import type { Task, Subtask } from '../../types/task';

const now = new Date();
const yesterday = new Date(Date.now() - 86400000);

const mockSubtasks: Subtask[] = [
  { id: 'sub-1', title: 'Ler material de referência', completed: true },
  { id: 'sub-2', title: 'Fazer anotações', completed: false },
  { id: 'sub-3', title: 'Revisar conceitos', completed: false },
];

export const tasksMock: Task[] = [
  {
    id: 'mock-task-1',
    userId: 'mock-user',
    title: 'Revisar anotações da aula',
    description: 'Organizar e revisar todo o material da última semana.',
    status: 'todo',
    estimatedPomodoros: 2,
    completedPomodoros: 0,
    tags: ['estudo', 'revisão'],
    cognitiveLoad: 'low',
    subtasks: mockSubtasks,
    createdAt: yesterday,
    order: 0,
  },
  {
    id: 'mock-task-2',
    userId: 'mock-user',
    title: 'Implementar componente de tarefas',
    description: 'Criar o TaskBoard com Kanban e drag-and-drop.',
    status: 'doing',
    estimatedPomodoros: 4,
    completedPomodoros: 2,
    tags: ['dev', 'frontend'],
    cognitiveLoad: 'high',
    subtasks: [
      { id: 'sub-4', title: 'Criar tipos TypeScript', completed: true },
      { id: 'sub-5', title: 'Criar serviço de tarefas', completed: true },
      { id: 'sub-6', title: 'Criar componentes visuais', completed: false },
    ],
    createdAt: yesterday,
    order: 0,
  },
  {
    id: 'mock-task-3',
    userId: 'mock-user',
    title: 'Configurar Firebase Auth',
    status: 'done',
    estimatedPomodoros: 3,
    completedPomodoros: 3,
    tags: ['backend', 'auth'],
    cognitiveLoad: 'medium',
    subtasks: [],
    createdAt: yesterday,
    order: 0,
  },
];
