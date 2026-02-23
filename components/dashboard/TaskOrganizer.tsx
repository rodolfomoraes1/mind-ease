import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Skeleton, Divider, IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { TaskBoard } from '../tasks/TaskBoard';
import { PomodoroTimer } from '../tasks/PomodoroTimer';
import { useTasksContext } from '../../context/TasksContext';
import type { Task } from '../../types/task';

interface TaskOrganizerProps {
  loading?: boolean;
}

export const TaskOrganizer: React.FC<TaskOrganizerProps> = ({ loading }) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { addCompletedPomodoro } = useTasksContext();

  if (loading) {
    return (
      <Card sx={{ mt: 4, p: 2, borderRadius: 3 }}>
        <CardContent>
          <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rounded" height={200} sx={{ borderRadius: 2 }} />
            ))}
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mt: 4, p: 2, borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, borderBottom: '2px solid #667eea', pb: 1 }}>
          📋 Organizador de Tarefas
        </Typography>

        {/* Pomodoro Timer — aparece quando uma tarefa é selecionada */}
        {activeTask && (
          <>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  ⏱️ Sessão ativa para: <strong>{activeTask.title}</strong>
                </Typography>
                <Tooltip title="Fechar timer">
                  <IconButton
                    size="small"
                    onClick={() => setActiveTask(null)}
                    sx={{ ml: 1 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <PomodoroTimer
                taskId={activeTask.id}
                onPomodoroComplete={() => {
                  addCompletedPomodoro(activeTask.id);
                }}
              />
            </Box>
            <Divider sx={{ my: 2 }} />
          </>
        )}

        {/* Kanban Board */}
        <TaskBoard onStartPomodoro={(task) => setActiveTask(task)} />
      </CardContent>
    </Card>
  );
};