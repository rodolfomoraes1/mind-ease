import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Container,
  Button,
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Divider,
  ListItemIcon,
} from '@mui/material';
import { Logout, AccountCircle, Settings } from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { TourButton } from './TourButton';
import { useUserTheme } from '../../context/ThemeContext';

/** Escurece levemente uma cor hex para o segundo ponto do gradiente */
function darkenHex(hex: string, amount = 40): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (n >> 16) - amount);
  const g = Math.max(0, ((n >> 8) & 0xff) - amount);
  const b = Math.max(0, (n & 0xff) - amount);
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

const FALLBACK_GRADIENT = 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)';

function getInitials(displayName: string | null | undefined): string {
  if (!displayName) return '?';
  return displayName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export const AppHeader = () => {
  const { user, loading, logout } = useAuth();
  const { preferences } = useUserTheme();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const primaryColor = preferences?.primaryColor ?? '#667EEA';
  const GRADIENT = `linear-gradient(135deg, ${primaryColor} 0%, ${darkenHex(primaryColor)} 100%)`;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    router.push('/login');
  };

  return (
    <AppBar
      id="tour-header"
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
            href={user ? '/dashboard' : '/'}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              textDecoration: 'none',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.02)' },
            }}
          >
            <Box
              sx={{
                background: GRADIENT,
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
                background: GRADIENT,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Mind Ease
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {loading ? (
              <Skeleton variant="circular" width={40} height={40} />
            ) : user ? (
              <>
                <TourButton />

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: '#4A5568',
                    display: { xs: 'none', sm: 'block' },
                    maxWidth: 160,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user.displayName ?? user.email}
                </Typography>

                <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                  <Avatar
                    src={user.photoURL ?? undefined}
                    alt={user.displayName ?? 'Usuário'}
                    sx={{
                      width: 40,
                      height: 40,
                      background: GRADIENT,
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: '2px solid transparent',
                      transition: 'border-color 0.2s',
                      '&:hover': { borderColor: '#667EEA' },
                    }}
                  >
                    {!user.photoURL && getInitials(user.displayName)}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  slotProps={{
                    paper: {
                      elevation: 4,
                      sx: {
                        mt: 1,
                        minWidth: 200,
                        borderRadius: 2,
                        overflow: 'visible',
                        '&::before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    },
                  }}
                >
                  <MenuItem disabled sx={{ opacity: '1 !important' }}>
                    <Box>
                      <Typography variant="body2" fontWeight={700} color="text.primary">
                        {user.displayName ?? 'Usuário'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </MenuItem>

                  <Divider />

                  <MenuItem
                    component={Link}
                    href="/dashboard"
                    onClick={handleMenuClose}
                  >
                    <ListItemIcon>
                      <AccountCircle fontSize="small" />
                    </ListItemIcon>
                    Dashboard
                  </MenuItem>

                  <MenuItem
                    component={Link}
                    href="/settings"
                    onClick={handleMenuClose}
                  >
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    Configurações
                  </MenuItem>

                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                      <Logout fontSize="small" color="error" />
                    </ListItemIcon>
                    Sair
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
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
                      background: GRADIENT,
                      transition: 'width 0.3s ease',
                    },
                    '&:hover': {
                      backgroundColor: 'transparent',
                      '&::after': { width: 'calc(100% - 32px)' },
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
                    background: GRADIENT,
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
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
