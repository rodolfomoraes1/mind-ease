import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Skeleton,
  Divider,
  Alert,
  Stack,
  Tooltip,
  Box,
  Collapse,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PersonIcon from '@mui/icons-material/Person';
import { useUserTheme } from '../../context/ThemeContext';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import TuneIcon from '@mui/icons-material/Tune';
import { useUserInfo } from '../../hooks/useUserInfo';
import { useFocusMode } from './FocusModeWrapper';
import { useSummaryMode } from './SummaryModeWrapper';
import { CardTourButton } from '../shared/CardTourButton';
import type { UserInfo } from '../../types/userInfo';

const navigationProfileLabel: Record<UserInfo['navigationProfile'], string> = {
  beginner: 'Iniciante',
  intermediate: 'Intermediário',
  advanced: 'Avançado',
};

const navigationProfileColor: Record<UserInfo['navigationProfile'], 'success' | 'warning' | 'info'> = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'info',
};

const spacingLabel: Record<string, string> = { compact: 'Compacto', normal: 'Normal', relaxed: 'Relaxado' };
const fontSizeLabel: Record<string, string> = { small: 'Pequena', medium: 'Média', large: 'Grande' };
const complexityLabel: Record<string, string> = { simple: 'Simples', full: 'Completa' };

interface UserInfoCardProps {
  loading?: boolean;
}

export const UserInfoCard: React.FC<UserInfoCardProps> = ({ loading: forceLoading }) => {
  const { userInfo, loading: hookLoading, error } = useUserInfo();
  const { preferences } = useUserTheme();
  const { isFocusMode } = useFocusMode();
  const { isSummaryMode } = useSummaryMode();
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  const primaryColor = preferences.primaryColor ?? '#667EEA';
  const loading = forceLoading || hookLoading;

  // Modos ativos (só se os dados já carregaram)
  const isFocused = isFocusMode && !loading && !!userInfo;
  const isSummarized = isSummaryMode && !loading && !!userInfo;

  if (error) {
    return (
      <Alert severity="warning" sx={{ mb: 4 }}>
        {error}
      </Alert>
    );
  }

  const getInitials = (name: string) =>
    name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();

  return (
    <Card
      id="tour-user-card"
      elevation={0}
      sx={{
        mb: 4,
        borderRadius: 3,
        border: `2px solid ${primaryColor}55`,
        borderLeft: `4px solid ${primaryColor}`,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: isFocused || isSummarized ? 0 : 3 }}>
          {loading ? (
            <Skeleton variant="circular" width={56} height={56} />
          ) : (
            <Avatar
              src={userInfo?.avatarUrl}
              sx={{ width: 56, height: 56, bgcolor: 'primary.main', fontSize: '1.2rem' }}
            >
              {userInfo ? getInitials(userInfo.name) : <PersonIcon />}
            </Avatar>
          )}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {loading ? (
              <>
                <Skeleton width={200} height={28} />
                <Skeleton width={160} height={20} sx={{ mt: 0.5 }} />
              </>
            ) : (
              <>
                <Typography variant="h6" fontWeight={700} color="text.primary" noWrap>
                  Olá, {userInfo?.name}! 👋
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {userInfo?.email}
                </Typography>
              </>
            )}
          </Box>

          {/* Modo Resumo: exibe chip de foco ativo no lugar do perfil */}
          {isSummarized ? (
            <Chip
              label={userInfo?.cognitivePreferences?.focusMode ? '🎯 Foco ativo' : '💤 Foco inativo'}
              color={userInfo?.cognitivePreferences?.focusMode ? 'primary' : 'default'}
              size="small"
              sx={{ fontWeight: 600, flexShrink: 0 }}
            />
          ) : (
            !loading && userInfo && (
              <Chip
                label={navigationProfileLabel[userInfo.navigationProfile]}
                color={navigationProfileColor[userInfo.navigationProfile]}
                size="small"
                sx={{ fontWeight: 600, flexShrink: 0 }}
              />
            )
          )}

          {/* Botão de tour por card */}
          <CardTourButton
            cardType="userInfo"
            title="👤 Seu Perfil"
            description="Este card exibe suas informações pessoais, necessidades específicas e preferências cognitivas configuradas."
            tips={[
              'Personalize sua experiência em Configurações',
              'Seu perfil de navegação afeta o Kanban e o tour',
              'No Modo Foco este card fica compacto por padrão',
            ]}
          />

          {/* Modo Foco: botão de expandir/colapsar */}
          {isFocused && (
            <IconButton
              size="small"
              onClick={() => setDetailsExpanded((v) => !v)}
              sx={{ flexShrink: 0 }}
            >
              {detailsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          )}
        </Box>

        {/* Detalhes: ocultos em resumo, colapsáveis em foco, sempre visíveis no modo normal */}
        <Collapse in={!isSummarized && (!isFocused || detailsExpanded)}>
          <Divider sx={{ mb: 3, mt: isFocused ? 2 : 0 }} />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
            gap: 3,
          }}
        >
          <Box>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}
            >
              <PersonIcon sx={{ fontSize: 14 }} /> Necessidades
            </Typography>
            {loading ? (
              <Stack direction="row" gap={1} flexWrap="wrap">
                <Skeleton width={60} height={24} sx={{ borderRadius: 4 }} />
                <Skeleton width={80} height={24} sx={{ borderRadius: 4 }} />
              </Stack>
            ) : userInfo?.specificNeeds?.length ? (
              <Stack direction="row" gap={1} flexWrap="wrap">
                {userInfo.specificNeeds.map((need) => (
                  <Chip key={need} label={need} size="small" variant="outlined" color="primary" />
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">Não informado</Typography>
            )}
          </Box>
          <Box>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}
            >
              <SchoolIcon sx={{ fontSize: 14 }} /> Rotinas
            </Typography>
            {loading ? (
              <>
                <Skeleton width="100%" height={18} />
                <Skeleton width="80%" height={18} sx={{ mt: 0.5 }} />
              </>
            ) : (
              <Stack spacing={0.5}>
                {userInfo?.studyRoutine && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SchoolIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="body2">{userInfo.studyRoutine}</Typography>
                  </Box>
                )}
                {userInfo?.workRoutine && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WorkIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="body2">{userInfo.workRoutine}</Typography>
                  </Box>
                )}
                {!userInfo?.studyRoutine && !userInfo?.workRoutine && (
                  <Typography variant="body2" color="text.secondary">Não configurado</Typography>
                )}
              </Stack>
            )}
          </Box>

          <Box>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}
            >
              <TuneIcon sx={{ fontSize: 14 }} /> Preferências cognitivas
            </Typography>
            {loading ? (
              <Stack spacing={0.5}>
                {[1, 2, 3, 4].map((i) => <Skeleton key={i} width="90%" height={18} />)}
              </Stack>
            ) : userInfo ? (
              <Stack spacing={0.5}>
                {[
                  { label: 'Complexidade', value: complexityLabel[userInfo.cognitivePreferences?.complexityLevel] },
                  { label: 'Espaçamento', value: spacingLabel[userInfo.cognitivePreferences?.spacingLevel] },
                  { label: 'Fonte', value: fontSizeLabel[userInfo.cognitivePreferences?.fontSize] },
                ].map(({ label, value }) => (
                  <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">{label}</Typography>
                    <Typography variant="body2" fontWeight={600}>{value}</Typography>
                  </Box>
                ))}
                <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                  <Tooltip title="Modo de foco">
                    <Chip
                      label="Foco"
                      size="small"
                      color={userInfo?.cognitivePreferences?.focusMode ? 'primary' : 'default'}
                      variant={userInfo?.cognitivePreferences?.focusMode ? 'filled' : 'outlined'}
                    />
                  </Tooltip>
                  <Tooltip title="Alertas cognitivos">
                    <Chip
                      label="Alertas"
                      size="small"
                      color={userInfo?.cognitivePreferences?.cognitiveAlerts ? 'primary' : 'default'}
                      variant={userInfo?.cognitivePreferences?.cognitiveAlerts ? 'filled' : 'outlined'}
                    />
                  </Tooltip>
                  <Tooltip title="Animações">
                    <Chip
                      label="Animações"
                      size="small"
                      color={userInfo?.cognitivePreferences?.animationsEnabled ? 'primary' : 'default'}
                      variant={userInfo?.cognitivePreferences?.animationsEnabled ? 'filled' : 'outlined'}
                    />
                  </Tooltip>
                </Box>
              </Stack>
            ) : null}
          </Box>
        </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};