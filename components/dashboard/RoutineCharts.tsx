import { Box, Card, CardContent, Typography } from '@mui/material';
import { useUserInfo } from '../../hooks/useUserInfo';
import { MfeChart } from '../external';

const studyData = {
  labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
  values: [2, 2.5, 2, 3, 2.5, 4, 1.5],
};

const workData = {
  labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
  values: [8, 8, 8, 8, 8, 4, 0],
};

interface RoutineChartsProps {
  loading?: boolean;
}

export const RoutineCharts: React.FC<RoutineChartsProps> = ({ loading }) => {
  const { userInfo } = useUserInfo();

  if (loading) {
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
        {[1, 2].map((i) => (
          <Card key={i} sx={{ p: 2, borderRadius: 2, height: 350 }}>
            <CardContent>
              <Box sx={{ width: '100%', height: 300, bgcolor: '#f0f0f0', borderRadius: 2 }} />
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
      <Card sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, borderBottom: '2px solid #667eea', pb: 1 }}>
          📚 Rotina de Estudos
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {userInfo?.studyRoutine || 'Nenhuma rotina configurada'}
        </Typography>
        <MfeChart
          title="Horas de Estudo por Dia"
          values={studyData.values}
          labels={studyData.labels}
          colors={['#4ECDC4']}
          height={250}
        />
      </Card>


      <Card sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, borderBottom: '2px solid #667eea', pb: 1 }}>
          💼 Rotina de Trabalho
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {userInfo?.workRoutine || 'Nenhuma rotina configurada'}
        </Typography>
        <MfeChart
          title="Horas de Trabalho por Dia"
          values={workData.values}
          labels={workData.labels}
          colors={['#FF6B6B']}
          height={250}
        />
      </Card>
    </Box>
  );
};