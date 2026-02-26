import React, { useState, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDroppable,
  rectIntersection,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function shouldIgnoreEvent(element: EventTarget | null): boolean {
  if (!(element instanceof HTMLElement)) return false;
  const INTERACTIVE = ['BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'A', 'LABEL'];
  return !!element.closest(INTERACTIVE.join(','));
}

class SmartPointerSensor extends PointerSensor {
  static activators = [
    {
      eventName: 'onPointerDown' as const,
      handler: ({ nativeEvent }: React.PointerEvent) => {
        if (!nativeEvent.isPrimary || nativeEvent.button !== 0) return false;
        if (shouldIgnoreEvent(nativeEvent.target)) return false;
        return true;
      },
    },
  ];
}

class SmartTouchSensor extends TouchSensor {
  static activators = [
    {
      eventName: 'onTouchStart' as const,
      handler: ({ nativeEvent }: React.TouchEvent) => {
        if (shouldIgnoreEvent(nativeEvent.target)) return false;
        return true;
      },
    },
  ];
}

import type { Task, TaskStatus } from '../../types/task';
import { useTasksContext } from '../../context/TasksContext';
import { useUserInfo } from '../../hooks/useUserInfo';
import { getProfileConfig } from '../../utils/navigationProfile';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';
import { CardTourButton } from '../shared/CardTourButton';

const COLUMN_CONFIG: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'todo', label: '📋 A Fazer', color: '#667EEA' },
  { id: 'doing', label: '⚡ Em Andamento', color: '#F6AD55' },
  { id: 'done', label: '✅ Concluído', color: '#68D391' },
];

interface SortableTaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, status: TaskStatus) => void;
  onSubtasksChange: (id: string, subtasks: Task['subtasks']) => void;
  onStartPomodoro: (task: Task) => void;
}

const SortableTaskCard = React.memo<SortableTaskCardProps>(function SortableTaskCard({ task, ...rest }) {
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
});

const DroppableColumnArea: React.FC<{
  id: string;
  color: string;
  isEmpty: boolean;
  isOver: boolean;
  children: React.ReactNode;
}> = ({ color, isEmpty, isOver, children }) => (
  <Box
    sx={{
      minHeight: isEmpty ? 120 : 'auto',
      borderRadius: 2,
      transition: 'background 0.15s',
      ...(isOver && { bgcolor: `${color}22`, outline: `2px dashed ${color}88` }),
    }}
  >
    {children}
  </Box>
);

interface ColumnWrapperProps {
  id: TaskStatus;
  label: string;
  color: string;
  columnTasks: Task[];
  isDoingFull: boolean;
  loading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, status: TaskStatus) => void;
  onSubtasksChange: (id: string, subtasks: Task['subtasks']) => void;
  onStartPomodoro: (task: Task) => void;
}

const ColumnWrapper = React.memo<ColumnWrapperProps>(function ColumnWrapper({
  id, label, color, columnTasks, isDoingFull, loading,
  onEdit, onDelete, onMove, onSubtasksChange, onStartPomodoro,
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        borderRadius: 3,
        borderColor: isOver ? `${color}99` : `${color}44`,
        bgcolor: `${color}08`,
        minHeight: 200,
        transition: 'border-color 0.15s',
      }}
    >

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 700, color, letterSpacing: 0.5, flex: 1 }}>
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

      <DroppableColumnArea id={id} color={color} isEmpty={columnTasks.length === 0} isOver={isOver}>
        <SortableContext
          items={columnTasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div ref={setNodeRef}>
            <Stack spacing={1.5}>
              {loading
                ? [1, 2].map((i) => (
                    <Skeleton key={i} variant="rounded" height={90} sx={{ borderRadius: 2 }} />
                  ))
                : columnTasks.map((task) => (
                    <SortableTaskCard
                      key={task.id}
                      task={task}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onMove={onMove}
                      onSubtasksChange={onSubtasksChange}
                      onStartPomodoro={onStartPomodoro}
                    />
                  ))}

              {!loading && columnTasks.length === 0 && (
                <Box
                  sx={{
                    height: 80,
                    border: '2px dashed',
                    borderColor: isOver ? `${color}88` : `${color}33`,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'border-color 0.15s',
                  }}
                >
                  <Typography variant="caption" color={isOver ? color : 'text.disabled'}>
                    {isOver ? 'Solte aqui' : 'Arraste tarefas aqui'}
                  </Typography>
                </Box>
              )}
            </Stack>
          </div>
        </SortableContext>
      </DroppableColumnArea>
    </Paper>
  );
});

interface TaskBoardProps {
  onStartPomodoro?: (task: Task) => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ onStartPomodoro }) => {
  const { tasks, loading, error, addTask, moveTaskTo, editTask, removeTask, setSubtasks } =
    useTasksContext();
  const { userInfo } = useUserInfo();

  const profile = userInfo?.navigationProfile ?? 'intermediate';
  const config = getProfileConfig(profile as 'beginner' | 'intermediate' | 'advanced');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(SmartPointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(SmartTouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const columns = config.simplifiedKanban
    ? COLUMN_CONFIG.filter((c) => c.id !== 'done')
    : COLUMN_CONFIG;

  const tasksByStatus = useMemo<Record<TaskStatus, Task[]>>(() => {
    const map: Record<TaskStatus, Task[]> = { todo: [], doing: [], done: [] };
    tasks.forEach((t) => map[t.status].push(t));
    return map;
  }, [tasks]);

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

      const overTask = tasks.find((t) => t.id === over.id);
      const overStatus = overTask?.status ?? (over.id as TaskStatus);

      const activeTask = tasks.find((t) => t.id === active.id);
      if (!activeTask) return;

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

      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
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
              <ColumnWrapper
                key={id}
                id={id}
                label={label}
                color={color}
                columnTasks={columnTasks}
                isDoingFull={isDoingFull}
                loading={!!loading}
                onEdit={handleEdit}
                onDelete={removeTask}
                onMove={moveTaskTo}
                onSubtasksChange={setSubtasks}
                onStartPomodoro={onStartPomodoro ?? (() => {})}
              />
            );
          })}
        </Box>

        {typeof window !== 'undefined' && createPortal(
          <DragOverlay>
            {activeTask ? (
              <TaskCard
                task={activeTask}
                dragging
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ) : null}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>

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
