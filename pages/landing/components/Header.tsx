import { AppBar, Toolbar, Container, Button, Box, Typography } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';

export const Header = () => {
  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #E2E8F0',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box 
            component={Link} 
            href="/"
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5,
              textDecoration: 'none',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)',
              }
            }}
          >
            <Box
              sx={{
                background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                borderRadius: '12px',
                p: 0.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                src="/images/logo/icone-512-512.svg"
                alt="Mind Ease"
                width={36}
                height={36}
              />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Mind Ease
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              component={Link}
              href="/login"
              sx={{
                color: '#4A5568',
                fontWeight: 600,
                px: 3,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 8,
                  left: 16,
                  width: '0%',
                  height: '2px',
                  background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                  transition: 'width 0.3s ease',
                },
                '&:hover': {
                  backgroundColor: 'transparent',
                  '&::after': {
                    width: 'calc(100% - 32px)',
                  },
                },
              }}
            >
              Login
            </Button>
            <Button
              component={Link}
              href="/register"
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                color: 'white',
                fontWeight: 600,
                px: 4,
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5A67D8 0%, #6B46A0 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                },
              }}
            >
              Cadastrar
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};