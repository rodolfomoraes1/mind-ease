import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Chip,
  Divider,
  Stack,
  Alert,
  Snackbar,
  Avatar,
  ToggleButton,
  ToggleButtonGroup,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  CircularProgress,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  StepButton,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppLayout } from '@/components/shared/AppLayout';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useCognitiveFeatures } from '@/hooks/useCognitiveFeatures';
import { useUserTheme } from '@/context/ThemeContext';
import type { NextPageWithLayout } from '../_app';
import type { CognitivePreferences } from '@/types/userInfo';

// ─── Constantes ──────────────────────────────────────────────────────────────

const COLOR_PRESETS = [
  { label: 'Roxo', value: '#667EEA' },
  { label: 'Violeta', value: '#7C3AED' },
  { label: 'Azul', value: '#4299E1' },
  { label: 'Ciano', value: '#0BC5EA' },
  { label: 'Verde', value: '#48BB78' },
  { label: 'Limão', value: '#84CC16' },
  { label: 'Laranja', value: '#ED8936' },
  { label: 'Vermelho', value: '#FC8181' },
  { label: 'Rosa', value: '#ED64A6' },
  { label: 'Índigo', value: '#4338CA' },
];

const AVAILABLE_NEEDS = [
  'TDAH',
  'Dislexia',
  'Autismo (TEA)',
  'Ansiedade',
  'TOC',
  'Discalculia',
  'Dispraxia',
  'Processamento auditivo',
  'Memória de trabalho',
  'Processamento sensorial',
];

const BORDER_RADIUS_OPTIONS = [
  { label: 'Quadrado', value: 4 },
  { label: 'Médio', value: 8 },
  { label: 'Arredondado', value: 16 },
];

// ─── Panel helper ─────────────────────────────────────────────────────────────

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </Box>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 2, fontWeight: 700 }}>
      {children}
    </Typography>
  );
}

// ─── Aba: Geral ───────────────────────────────────────────────────────────────

function GeneralTab() {
  const { userInfo, loading, updateProfile } = useUserInfo();
  const [name, setName] = useState(userInfo?.name ?? '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    if (userInfo?.name) setName(userInfo.name);
  }, [userInfo?.name]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ name: name.trim() });
      setSuccess(true);
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (n: string) =>
    n
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();

  return (
    <Stack spacing={3}>
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <SectionTitle>Perfil</SectionTitle>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
            <Avatar
              src={userInfo?.avatarUrl}
              sx={{
                width: 72,
                height: 72,
                bgcolor: 'primary.main',
                fontSize: '1.5rem',
                fontWeight: 700,
              }}
            >
              {loading ? '…' : getInitials(userInfo?.name ?? 'U')}
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary">
                A foto de perfil é sincronizada com sua conta Google/Facebook.
              </Typography>
            </Box>
          </Box>

          <Stack spacing={2}>
            <TextField
              label="Nome de exibição"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              fullWidth
            />
            <TextField
              label="Email"
              value={userInfo?.email ?? ''}
              disabled
              fullWidth
              helperText="O email é gerenciado pelo provedor de autenticação."
            />
          </Stack>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
              onClick={handleSave}
              disabled={saving || loading || !name.trim()}
            >
              {saving ? 'Salvando…' : 'Salvar nome'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Nome atualizado com sucesso!
        </Alert>
      </Snackbar>
    </Stack>
  );
}

// ─── Aba: Aparência ───────────────────────────────────────────────────────────

function AppearanceTab() {
  const { preferences: themePrefs, updatePreferences } = useUserTheme();
  const { preferences: cogPrefs, setFontSize, setSpacingLevel } = useCognitiveFeatures();

  const handleColorSelect = useCallback(
    (color: string) => {
      updatePreferences({ primaryColor: color });
    },
    [updatePreferences],
  );

  return (
    <Stack spacing={3}>
      {/* Cor primária */}
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <SectionTitle>Cor primária</SectionTitle>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {COLOR_PRESETS.map(({ label, value }) => (
              <Tooltip title={label} key={value}>
                <Box
                  onClick={() => handleColorSelect(value)}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: value,
                    cursor: 'pointer',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                    outline: themePrefs.primaryColor === value ? `3px solid ${value}` : 'none',
                    outlineOffset: 2,
                    '&:hover': { transform: 'scale(1.15)', boxShadow: 3 },
                  }}
                />
              </Tooltip>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Modo */}
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <SectionTitle>Modo de cor</SectionTitle>
          <ToggleButtonGroup
            value={themePrefs.mode}
            exclusive
            onChange={(_, val) => val && updatePreferences({ mode: val })}
            sx={{ flexWrap: 'wrap', gap: 1 }}
          >
            <ToggleButton value="light" sx={{ px: 3, borderRadius: '8px !important' }}>
              ☀️ Claro
            </ToggleButton>
            <ToggleButton value="dark" sx={{ px: 3, borderRadius: '8px !important' }}>
              🌙 Escuro
            </ToggleButton>
            <ToggleButton value="opaque" sx={{ px: 3, borderRadius: '8px !important' }}>
              🔮 Opaco
            </ToggleButton>
          </ToggleButtonGroup>
        </CardContent>
      </Card>

      {/* Tipografia e espaçamento */}
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <SectionTitle>Tipografia & Espaçamento</SectionTitle>
          <Stack spacing={3}>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Tamanho de fonte
              </Typography>
              <ToggleButtonGroup
                value={cogPrefs?.fontSize ?? themePrefs.fontSize}
                exclusive
                onChange={(_, val) => val && setFontSize(val as CognitivePreferences['fontSize'])}
              >
                <ToggleButton value="small" sx={{ px: 3 }}>A</ToggleButton>
                <ToggleButton value="medium" sx={{ px: 3, fontSize: '1.1rem' }}>A</ToggleButton>
                <ToggleButton value="large" sx={{ px: 3, fontSize: '1.3rem' }}>A</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Espaçamento entre elementos
              </Typography>
              <ToggleButtonGroup
                value={cogPrefs?.spacingLevel ?? themePrefs.spacingLevel ?? 'normal'}
                exclusive
                onChange={(_, val) => val && setSpacingLevel(val as CognitivePreferences['spacingLevel'])}
              >
                <ToggleButton value="compact" sx={{ px: 3 }}>Compacto</ToggleButton>
                <ToggleButton value="normal" sx={{ px: 3 }}>Normal</ToggleButton>
                <ToggleButton value="relaxed" sx={{ px: 3 }}>Relaxado</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Border radius */}
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <SectionTitle>Estilo dos cantos</SectionTitle>
          <ToggleButtonGroup
            value={themePrefs.borderRadius ?? 8}
            exclusive
            onChange={(_, val) => val !== null && updatePreferences({ borderRadius: val })}
          >
            {BORDER_RADIUS_OPTIONS.map(({ label, value }) => (
              <ToggleButton key={value} value={value} sx={{ px: 3 }}>
                {label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </CardContent>
      </Card>
    </Stack>
  );
}

// ─── Aba: Cognitivo ───────────────────────────────────────────────────────────

function CognitiveTab() {
  const {
    preferences,
    toggleFocusMode,
    toggleSummaryMode,
    toggleAnimations,
    toggleCognitiveAlerts,
    setComplexityLevel,
    updatePreference,
  } = useCognitiveFeatures();

  const [alertMinutes, setAlertMinutes] = React.useState<number>(preferences?.alertIntervalMinutes ?? 25);

  React.useEffect(() => {
    if (preferences?.alertIntervalMinutes !== undefined) {
      setAlertMinutes(preferences.alertIntervalMinutes);
    }
  }, [preferences?.alertIntervalMinutes]);

  if (!preferences) return null;

  return (
    <Stack spacing={3}>
      {/* Modos de visualização */}
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <SectionTitle>Modos de visualização</SectionTitle>
          <Stack spacing={1} divider={<Divider />}>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.focusMode}
                  onChange={toggleFocusMode}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body1" fontWeight={600}>Modo de Foco</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Esconde cards não essenciais para reduzir distrações
                  </Typography>
                </Box>
              }
              sx={{ py: 1 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.summaryMode}
                  onChange={toggleSummaryMode}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body1" fontWeight={600}>Modo Resumo</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Exibe versão condensada dos cards (apenas títulos e dados essenciais)
                  </Typography>
                </Box>
              }
              sx={{ py: 1 }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Complexidade */}
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <SectionTitle>Complexidade da interface</SectionTitle>
          <FormControl>
            <FormLabel sx={{ mb: 1, fontSize: '0.85rem' }}>
              Define quanta informação é exibida de uma vez
            </FormLabel>
            <RadioGroup
              value={preferences.complexityLevel}
              onChange={(e) =>
                setComplexityLevel(e.target.value as CognitivePreferences['complexityLevel'])
              }
            >
              <FormControlLabel value="simple" control={<Radio />} label="Simples — sem gráficos, apenas tarefas e perfil" />
              <FormControlLabel value="full" control={<Radio />} label="Completa — exibe gráficos de rotina e todos os dados" />
            </RadioGroup>
          </FormControl>
        </CardContent>
      </Card>

      {/* Alertas e animações */}
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <SectionTitle>Acessibilidade & Conforto</SectionTitle>
          <Stack spacing={1} divider={<Divider />}>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.cognitiveAlerts}
                  onChange={toggleCognitiveAlerts}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body1" fontWeight={600}>Alertas cognitivos</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Popups de pausa após X minutos de foco contínuo
                  </Typography>
                </Box>
              }
              sx={{ py: 1 }}
            />
            {preferences.cognitiveAlerts && (
              <Box sx={{ pl: 1, pb: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Intervalo do primeiro alerta
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TextField
                    type="number"
                    size="small"
                    value={alertMinutes}
                    onChange={(e) => setAlertMinutes(Math.max(1, parseInt(e.target.value) || 25))}
                    onBlur={() => updatePreference('alertIntervalMinutes', alertMinutes)}
                    inputProps={{ min: 1, max: 120, step: 5 }}
                    sx={{ width: 90 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    minutos &nbsp;→&nbsp; 1º alerta: <strong>{alertMinutes}min</strong> &nbsp;|
                    &nbsp; 2º alerta: <strong>{alertMinutes * 2}min</strong>
                  </Typography>
                </Box>
              </Box>
            )}
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.animationsEnabled}
                  onChange={toggleAnimations}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body1" fontWeight={600}>Animações</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Desative para reduzir estímulos visuais
                  </Typography>
                </Box>
              }
              sx={{ py: 1 }}
            />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

// ─── Aba: Perfil & Necessidades ───────────────────────────────────────────────

function ProfileTab() {
  const { userInfo, loading, updateProfile } = useUserInfo();
  const [studyRoutine, setStudyRoutine] = useState(userInfo?.studyRoutine ?? '');
  const [workRoutine, setWorkRoutine] = useState(userInfo?.workRoutine ?? '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    if (userInfo) {
      setStudyRoutine(userInfo.studyRoutine ?? '');
      setWorkRoutine(userInfo.workRoutine ?? '');
    }
  }, [userInfo]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ studyRoutine, workRoutine });
      setSuccess(true);
    } finally {
      setSaving(false);
    }
  };

  const toggleNeed = async (need: string) => {
    if (!userInfo) return;
    const current = userInfo.specificNeeds ?? [];
    const updated = current.includes(need)
      ? current.filter((n) => n !== need)
      : [...current, need];
    await updateProfile({ specificNeeds: updated });
  };

  const handleProfileChange = async (value: string) => {
    await updateProfile({ navigationProfile: value as 'beginner' | 'intermediate' | 'advanced' });
  };

  return (
    <Stack spacing={3}>
      {/* Perfil de navegação */}
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <SectionTitle>Perfil de navegação</SectionTitle>
          <FormControl>
            <FormLabel sx={{ mb: 1, fontSize: '0.85rem' }}>
              Define a experiência padrão e o nível de orientação
            </FormLabel>
            <RadioGroup
              value={userInfo?.navigationProfile ?? 'beginner'}
              onChange={(e) => handleProfileChange(e.target.value)}
            >
              <FormControlLabel
                value="beginner"
                control={<Radio />}
                label="Iniciante — mais dicas, tour guiado, interface simplificada"
              />
              <FormControlLabel
                value="intermediate"
                control={<Radio />}
                label="Intermediário — equilíbrio entre orientação e autonomia"
              />
              <FormControlLabel
                value="advanced"
                control={<Radio />}
                label="Avançado — sem tutoriais, acesso a todas as funcionalidades"
              />
            </RadioGroup>
          </FormControl>
        </CardContent>
      </Card>

      {/* Necessidades específicas */}
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <SectionTitle>Necessidades específicas</SectionTitle>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Selecione as condições que se aplicam a você. Isso personaliza a interface automaticamente.
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {AVAILABLE_NEEDS.map((need) => {
              const selected = userInfo?.specificNeeds?.includes(need) ?? false;
              return (
                <Chip
                  key={need}
                  label={need}
                  clickable
                  onClick={() => toggleNeed(need)}
                  color={selected ? 'primary' : 'default'}
                  variant={selected ? 'filled' : 'outlined'}
                  disabled={loading}
                />
              );
            })}
          </Box>
        </CardContent>
      </Card>

      {/* Rotinas */}
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <SectionTitle>Rotinas</SectionTitle>
          <Stack spacing={2}>
            <TextField
              label="📚 Rotina de estudos"
              value={studyRoutine}
              onChange={(e) => setStudyRoutine(e.target.value)}
              placeholder="Ex: Segunda a Sexta, 19h–21h"
              fullWidth
              helperText="Informe seus horários habituais de estudo"
            />
            <TextField
              label="💼 Rotina de trabalho"
              value={workRoutine}
              onChange={(e) => setWorkRoutine(e.target.value)}
              placeholder="Ex: Segunda a Sexta, 9h–18h"
              fullWidth
              helperText="Informe seus horários habituais de trabalho"
            />
          </Stack>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
              onClick={handleSave}
              disabled={saving || loading}
            >
              {saving ? 'Salvando…' : 'Salvar rotinas'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Rotinas salvas com sucesso!
        </Alert>
      </Snackbar>
    </Stack>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

const STEPS = [
  { label: 'Geral', icon: '👤', description: 'Nome e perfil' },
  { label: 'Aparência', icon: '🎨', description: 'Cores e layout' },
  { label: 'Cognitivo', icon: '🧠', description: 'Modos e alertas' },
  { label: 'Perfil', icon: '🌱', description: 'Rotinas e necessidades' },
];

function SettingsContent() {
  const [tab, setTab] = useState(0);

  return (
    <>
      <Head>
        <title>Mind Ease — Configurações</title>
        <meta name="description" content="Personalize sua experiência no Mind Ease" />
      </Head>

      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Header da página */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Button
            component={Link}
            href="/dashboard"
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            size="small"
            sx={{ borderRadius: 2 }}
          >
            Dashboard
          </Button>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              ⚙️ Configurações
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Personalize sua experiência no Mind Ease
            </Typography>
          </Box>
        </Box>

        {/* Stepper de progresso */}
        <Card
          elevation={0}
          sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, mb: 2, px: 2, py: 2 }}
        >
          <Stepper nonLinear activeStep={tab} alternativeLabel>
            {STEPS.map(({ label, icon, description }, index) => (
              <Step key={label} completed={index < tab}>
                <StepButton onClick={() => setTab(index)}>
                  <StepLabel
                    optional={
                      <Typography variant="caption" color="text.secondary">
                        {description}
                      </Typography>
                    }
                  >
                    {icon} {label}
                  </StepLabel>
                </StepButton>
              </Step>
            ))}
          </Stepper>
        </Card>

        <Card
          elevation={0}
          sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'visible' }}
        >
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              px: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
              '& .MuiTab-root': { minWidth: 100, fontWeight: 600, textTransform: 'none' },
            }}
          >
            <Tab label="👤 Geral" id="settings-tab-0" aria-controls="settings-tabpanel-0" />
            <Tab label="🎨 Aparência" id="settings-tab-1" aria-controls="settings-tabpanel-1" />
            <Tab label="🧠 Cognitivo" id="settings-tab-2" aria-controls="settings-tabpanel-2" />
            <Tab label="🌱 Perfil" id="settings-tab-3" aria-controls="settings-tabpanel-3" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            <TabPanel value={tab} index={0}><GeneralTab /></TabPanel>
            <TabPanel value={tab} index={1}><AppearanceTab /></TabPanel>
            <TabPanel value={tab} index={2}><CognitiveTab /></TabPanel>
            <TabPanel value={tab} index={3}><ProfileTab /></TabPanel>
          </Box>

          {/* Navegação inferior */}
          <Box
            sx={{
              px: 3,
              pb: 3,
              pt: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid',
              borderColor: 'divider',
              mt: 1,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => setTab((t) => Math.max(0, t - 1))}
              disabled={tab === 0}
              sx={{ borderRadius: 2 }}
            >
              ← Anterior
            </Button>

            <Typography variant="caption" color="text.secondary">
              Passo {tab + 1} de {STEPS.length}
            </Typography>

            {tab < STEPS.length - 1 ? (
              <Button
                variant="contained"
                onClick={() => setTab((t) => Math.min(STEPS.length - 1, t + 1))}
                sx={{ borderRadius: 2 }}
              >
                Próximo →
              </Button>
            ) : (
              <Button
                variant="contained"
                color="success"
                sx={{ borderRadius: 2 }}
                disabled
              >
                ✅ Concluído
              </Button>
            )}
          </Box>
        </Card>
      </Container>
    </>
  );
}

function Settings() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}

(Settings as NextPageWithLayout).getLayout = (page: React.ReactElement) => (
  <AppLayout>{page}</AppLayout>
);

export default Settings;
