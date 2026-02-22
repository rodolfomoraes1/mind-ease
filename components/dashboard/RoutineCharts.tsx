'use client';

import { Box, Card, Typography, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import { useUserInfo } from '../../hooks/useUserInfo';
import { useUserTheme } from '../../context/ThemeContext';
import { CardTourButton } from '../shared/CardTourButton';

const DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

// Horas fictícias por dia — substituível por dados reais do Firestore
const studyHours = [2, 3, 2, 4, 3, 5, 1];
const workHours  = [8, 8, 8, 8, 8, 4, 0];

interface BarChartProps {
  data: number[];
  labels: string[];
  color: string;
  maxValue?: number;
}

function BarChart({ data, labels, color, maxValue }: BarChartProps) {
  const max = maxValue ?? Math.max(...data, 1);
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 120, mt: 2 }}>
      {data.map((value, i) => (
        <Tooltip key={i} title={`${labels[i]}: ${value}h`} arrow>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            <Box
              component={motion.div}
              initial={{ scaleY: 0, originY: 1 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: 'easeOut' }}
              sx={{
                width: '100%',
                height: `${(value / max) * 100}%`,
                minHeight: value > 0 ? 4 : 0,
                bgcolor: color,
                borderRadius: '4px 4px 0 0',
                opacity: 0.85,
                transformOrigin: 'bottom',
                cursor: 'default',
                transition: 'opacity 0.2s',
                '&:hover': { opacity: 1 },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', lineHeight: 1 }}>
              {labels[i]}
            </Typography>
          </Box>
        </Tooltip>
      ))}
    </Box>
  );
}

interface RoutineChartsProps {
  loading?: boolean;
}

export const RoutineCharts: React.FC<RoutineChartsProps> = ({ loading }) => {
  const { userInfo } = useUserInfo();
  const { preferences } = useUserTheme();
  const primaryColor = preferences?.primaryColor ?? '#667EEA';

  if (loading) {
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mt: 4 }}>
        {[1, 2].map((i) => (
          <Card key={i} sx={{ p: 2, borderRadius: 2, height: 220 }} />
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mt: 4 }}>
      <Card sx={{ p: 2.5, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, borderBottom: `2px solid ${primaryColor}`, pb: 1, mb: 0.5 }}>
          <Typography variant="h6" sx={{ flex: 1 }}>
            📚 Rotina de Estudos
          </Typography>
          <CardTourButton
            cardType="charts"
            title="📊 Gráficos de Rotina"
            description="Visualize sua distribuição semanal de horas de estudo e trabalho."
            tips={['Configure suas rotinas em Configurações → Perfil', 'Oculte este card com Modo Foco ou Complexidade Simples']}
          />
        </Box>
        <Typography variant="caption" color="text.secondary">
          {userInfo?.studyRoutine || 'Rotina não configurada'}
        </Typography>
        <BarChart data={studyHours} labels={DAYS} color={primaryColor} maxValue={8} />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
          Total semanal: {studyHours.reduce((a, b) => a + b, 0)}h
        </Typography>
      </Card>

      <Card sx={{ p: 2.5, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 0.5, borderBottom: '2px solid #FF6B6B', pb: 1 }}>
          💼 Rotina de Trabalho
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {userInfo?.workRoutine || 'Rotina não configurada'}
        </Typography>
        <BarChart data={workHours} labels={DAYS} color="#FF6B6B" maxValue={10} />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
          Total semanal: {workHours.reduce((a, b) => a + b, 0)}h
        </Typography>
      </Card>
    </Box>
  );

};