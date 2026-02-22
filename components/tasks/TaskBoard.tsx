import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Skeleton,
  Alert,
  Tooltip,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import type { Task, TaskStatus } from '../../types/task';
import { useTasks } from '../../hooks/useTasks';
import { useUserInfo } from '../../hooks/useUserInfo';
import { getProfileConfig } from '../../utils/navigationProfile';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';
import { CardTourButton } from '../shared/CardTourButton';

// ─── Coluna do Kanban ────────────────────────────────────────────────────────

const COLUMN_CONFIG: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'todo', label: '📋 A Fazer', color: '#667EEA' },
  { id: 'doing', label: '⚡ Em Andamento', color: '#F6AD55' },
  { id: 'done', label: '✅ Concluído', color: '#68D391' },
];

// ─── Item Sortable ───────────────────────────────────────────────────────────

interface SortableTaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, status: TaskStatus) => void;
  onSubtasksChange: (id: string, subtasks: Task['subtasks']) => void;
  onStartPomodoro: (task: Task) => void;
}

const SortableTaskCard: React.FC<SortableTaskCardProps> = ({ task, ...rest }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  return (
    <Box
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
    >
      <TaskCard task={task} dragging={false} {...rest} />
    </Box>
  );
};

// ─── TaskBoard principal ─────────────────────────────────────────────────────

interface TaskBoardProps {
  /** Callback para informar qual tarefa o Pomodoro deve iniciar */
  onStartPomodoro?: (task: Task) => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ onStartPomodoro }) => {
  const { tasks, loading, error, addTask, moveTaskTo, editTask, removeTask, setSubtasks } =
    useTasks();
  const { userInfo } = useUserInfo();

  const profile = userInfo?.navigationProfile ?? 'intermediate';
  const config = getProfileConfig(profile as 'beginner' | 'intermediate' | 'advanced');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  // Colunas visíveis
  const columns = config.simplifiedKanban
    ? COLUMN_CONFIG.filter((c) => c.id !== 'done')
    : COLUMN_CONFIG;

  // Mapa status → tarefas
  const tasksByStatus = useMemo<Record<TaskStatus, Task[]>>(() => {
    const map: Record<TaskStatus, Task[]> = { todo: [], doing: [], done: [] };
    tasks.forEach((t) => map[t.status].push(t));
    return map;
  }, [tasks]);

  // DnD handlers
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const found = tasks.find((t) => t.id === event.active.id);
      setActiveTask(found ?? null);
    },
    [tasks],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveTask(null);
      if (!over || active.id === over.id) return;

      // Verifica se 'over' é um ID de tarefa ou de coluna
      const overTask = tasks.find((t) => t.id === over.id);
      const overStatus = overTask?.status ?? (over.id as TaskStatus);

      const activeTask = tasks.find((t) => t.id === active.id);
      if (!activeTask) return;

      // Bloqueia se maxTasksInDoing for atingido
      if (
        overStatus === 'doing' &&
        activeTask.status !== 'doing' &&
        tasksByStatus.doing.length >= config.maxTasksInDoing
      ) {
        return;
      }

      if (overStatus !== activeTask.status) {
        moveTaskTo(activeTask.id, overStatus);
      }
    },
    [tasks, tasksByStatus, config.maxTasksInDoing, moveTaskTo],
  );

  // Handlers do modal
  const handleOpenCreate = () => {
    setEditingTask(undefined);
    setModalOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleModalSubmit = async (data: {
    title: string;
    description: string;
    cognitiveLoad: Task['cognitiveLoad'];
    estimatedPomodoros: number;
    tags: string[];
    subtasks: Task['subtasks'];
    status: TaskStatus;
  }) => {
    if (editingTask) {
      await editTask(editingTask.id, data);
    } else {
      await addTask({
        title: data.title,
        description: data.description,
        cognitiveLoad: data.cognitiveLoad,
        estimatedPomodoros: data.estimatedPomodoros,
        tags: data.tags,
        subtasks: data.subtasks,
        status: data.status,
        order: tasksByStatus[data.status].length,
      });
    }
  };

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box id="tour-task-board">
      {/* Barra superior */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Tarefas</Typography>
          <CardTourButton
            cardType="kanban"
            title="📋 Organizador de Tarefas"
            description="Gerencie suas tarefas com o método Kanban. Arraste os cards entre as colunas conforme avançar."
            tips={[
              'Crie tarefas com carga cognitiva para priorizar melhor',
              'Arraste o card para mover entre colunas',
              'Clique em ⏱️ no card para iniciar o Pomodoro',
              'Expanda um card para ver e editar as subtarefas',
            ]}
          />
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          {config.showLimits && (
            <Tooltip title={`Máximo de ${config.maxTasksInDoing} tarefa(s) em andamento simultânea(s)`}>
              <Chip
                size="small"
                label={`⚡ ${tasksByStatus.doing.length}/${config.maxTasksInDoing}`}
                color={tasksByStatus.doing.length >= config.maxTasksInDoing ? 'warning' : 'default'}
              />
            </Tooltip>
          )}

          <Tooltip title="Adicionar tarefa" disableHoverListener={!config.showTooltips}>
            <Button
              id="tour-add-task"
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
              sx={{ borderRadius: 2 }}
            >
              Nova tarefa
            </Button>
          </Tooltip>
        </Stack>
      </Box>

      {/* Kanban */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
            gap: 2,
            alignItems: 'start',
          }}
        >
          {columns.map(({ id, label, color }) => {
            const columnTasks = tasksByStatus[id];
            const isDoingFull =
              id === 'doing' && tasksByStatus.doing.length >= config.maxTasksInDoing;

            return (
              <Paper
                key={id}
                variant="outlined"
                sx={{
                  p: 1.5,
                  borderRadius: 3,
                  borderColor: `${color}44`,
                  bgcolor: `${color}08`,
                  minHeight: 200,
                }}
              >
                {/* Cabeçalho da coluna */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 700, color, letterSpacing: 0.5, flex: 1 }}
                  >
                    {label}
                  </Typography>
                  <Chip
                    label={columnTasks.length}
                    size="small"
                    sx={{ height: 18, fontSize: '0.65rem', bgcolor: `${color}22`, color }}
                  />
                  {isDoingFull && (
                    <Chip label="Cheio" size="small" color="warning" sx={{ height: 18, fontSize: '0.6rem' }} />
                  )}
                </Box>

                {/* Lista de tarefas */}
                <SortableContext
                  items={columnTasks.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <Stack spacing={1.5}>
                    {loading
                      ? [1, 2].map((i) => (
                          <Skeleton key={i} variant="rounded" height={90} sx={{ borderRadius: 2 }} />
                        ))
                      : columnTasks.map((task) => (
                          <SortableTaskCard
                            key={task.id}
                            task={task}
                            onEdit={handleEdit}
                            onDelete={removeTask}
                            onMove={moveTaskTo}
                            onSubtasksChange={setSubtasks}
                            onStartPomodoro={onStartPomodoro ?? (() => {})}
                          />
                        ))}

                    {/* Placeholder quando vazia */}
                    {!loading && columnTasks.length === 0 && (
                      <Box
                        sx={{
                          height: 80,
                          border: '2px dashed',
                          borderColor: `${color}33`,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="caption" color="text.disabled">
                          Arraste tarefas aqui
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </SortableContext>
              </Paper>
            );
          })}
        </Box>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeTask ? (
            <TaskCard
              task={activeTask}
              dragging
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Modal */}
      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingTask}
        mode={editingTask ? 'edit' : 'create'}
      />
    </Box>
  );
};
