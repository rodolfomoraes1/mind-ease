import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import { Abc, Hub, Psychology, CircleNotifications } from '@mui/icons-material';
import Link from 'next/link';

const features = [
  { icon: <Abc />, text: 'Contraste, espaçamento e tamanho de fonte', color: '#667EEA' },
  { icon: <Psychology />, text: 'Modo de foco', color: '#764BA2' },
  { icon: <Hub />, text: 'Modo resumo / modo detalhado', color: '#9F7AEA' },
  { icon: <CircleNotifications />, text: 'Alertas cognitivos', color: '#FF6B6B' },
];

export const Hero = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #F7FAFC 0%, #EDF2F7 100%)',
        pt: { xs: 8, md: 0 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ pr: { md: 4 } }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 800,
                  lineHeight: 1.2,
                  mb: 2,
                }}
              >
                Sua Jornada de{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Aprendizado
                </Box>
              </Typography>

              <Box sx={{ display: 'flex', gap: 3, mb: 6 }}>
                <Button
                  component={Link}
                  href="/register"
                  variant="contained"
                  size="large"
                  sx={{
                    background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                    color: 'white',
                    fontWeight: 600,
                    px: 5,
                    py: 1.8,
                    fontSize: '1.1rem',
                    borderRadius: '16px',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.5)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 35px rgba(102, 126, 234, 0.7)',
                    },
                  }}
                >
                  Começar Agora
                </Button>
              </Box>

            </Box>
          </Grid>

          {/* Features Cards */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {features.map((feature, index) => (
                <Paper
                  key={index}
                  elevation={2}
                  sx={{
                    p: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    transition: 'all 0.3s ease',
                    cursor: 'default',
                    '&:hover': {
                      transform: 'translateX(10px)',
                      boxShadow: `0 10px 25px ${feature.color}20`,
                      borderColor: feature.color,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: `${feature.color}10`,
                      color: feature.color,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: '#2D3748' }}>
                    {feature.text}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};