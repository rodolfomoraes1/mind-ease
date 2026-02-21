import { Card, CardContent, Typography, Box, Paper } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';

interface TaskOrganizerProps {
  loading?: boolean;
}

export const TaskOrganizer: React.FC<TaskOrganizerProps> = ({ loading }) => {
  if (loading) {
    return (
      <Card sx={{ mt: 4, p: 2, borderRadius: 2, height: 200 }}>
        <CardContent>
          <Box sx={{ width: '100%', height: 150, bgcolor: '#f0f0f0', borderRadius: 2 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mt: 4, p: 2, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, borderBottom: '2px solid #667eea', pb: 1 }}>
          📋 Organizador de Tarefas
        </Typography>
        
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            backgroundColor: '#f8f9ff',
            borderRadius: 2,
            border: '2px dashed #667eea',
          }}
        >
          <AssignmentIcon sx={{ fontSize: 48, color: '#667eea', mb: 2, opacity: 0.5 }} />
          <Typography variant="body1" color="text.secondary">
            Em breve você poderá gerenciar suas tarefas aqui
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Funcionalidade em desenvolvimento
          </Typography>
        </Paper>
      </CardContent>
    </Card>
  );
};