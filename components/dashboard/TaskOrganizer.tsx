import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Skeleton, Divider } from '@mui/material';
import { TaskBoard } from '../tasks/TaskBoard';
import { PomodoroTimer } from '../tasks/PomodoroTimer';
import type { Task } from '../../types/task';

interface TaskOrganizerProps {
  loading?: boolean;
}

export const TaskOrganizer: React.FC<TaskOrganizerProps> = ({ loading }) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

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
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                ⏱️ Sessão ativa para:{' '}
                <strong>{activeTask.title}</strong>
              </Typography>
              <PomodoroTimer
                taskId={activeTask.id}
                onPomodoroComplete={() => {
                  // Pomodoro registrado automaticamente no hook
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