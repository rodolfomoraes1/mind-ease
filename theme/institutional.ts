import { createTheme } from '@mui/material/styles';

export const institutionalTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667EEA', // Roxo principal da marca
      light: '#9F7AEA',
      dark: '#4C51BF',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#764BA2', // Roxo secundário
      light: '#9F7AEA',
      dark: '#553C9A',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F7FAFC',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 16, // Médio (padrão)
    h1: { fontSize: '2.5rem', fontWeight: 600 },
    h2: { fontSize: '2rem', fontWeight: 500 },
    h3: { fontSize: '1.5rem', fontWeight: 500 },
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.875rem' },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 20px',
        },
        contained: {
          boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#667EEA',
            },
          },
        },
      },
    },
  },
});