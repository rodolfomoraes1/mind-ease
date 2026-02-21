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
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import TuneIcon from '@mui/icons-material/Tune';
import { useUserInfo } from '../../hooks/useUserInfo';
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

const contrastLabel: Record<string, string> = { low: 'Baixo', medium: 'Médio', high: 'Alto' };
const spacingLabel: Record<string, string> = { compact: 'Compacto', normal: 'Normal', relaxed: 'Relaxado' };
const fontSizeLabel: Record<string, string> = { small: 'Pequena', medium: 'Média', large: 'Grande' };
const complexityLabel: Record<string, string> = { simple: 'Simples', moderate: 'Moderada', full: 'Completa' };

interface UserInfoCardProps {
  loading?: boolean;
}

export const UserInfoCard: React.FC<UserInfoCardProps> = ({ loading: forceLoading }) => {
  const { userInfo, loading: hookLoading, error } = useUserInfo();

  const loading = forceLoading || hookLoading;

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
      elevation={0}
      sx={{
        mb: 4,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
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
          <Box sx={{ flex: 1 }}>
            {loading ? (
              <>
                <Skeleton width={200} height={28} />
                <Skeleton width={160} height={20} sx={{ mt: 0.5 }} />
              </>
            ) : (
              <>
                <Typography variant="h6" fontWeight={700} color="text.primary">
                  Olá, {userInfo?.name}! 👋
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {userInfo?.email}
                </Typography>
              </>
            )}
          </Box>
          {!loading && userInfo && (
            <Chip
              label={navigationProfileLabel[userInfo.navigationProfile]}
              color={navigationProfileColor[userInfo.navigationProfile]}
              size="small"
              sx={{ fontWeight: 600 }}
            />
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

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
                  { label: 'Contraste', value: contrastLabel[userInfo.cognitivePreferences?.contrastLevel] },
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
      </CardContent>
    </Card>
  );
};