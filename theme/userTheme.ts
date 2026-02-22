import { createTheme, Theme } from '@mui/material/styles';
import { UserThemePreferences, FontSize, SpacingLevel } from './types';

// Mapeamento de tamanhos de fonte
const fontSizeMap: Record<FontSize, number> = {
  small: 14,
  medium: 16,
  large: 18,
};

// Mapeamento de espaçamento → valor base do MUI (px)
const spacingMap: Record<SpacingLevel, number> = {
  compact: 4,
  normal: 8,
  relaxed: 12,
};

// Mapeamento de modos
const modeMap = {
  light: {
    background: '#F7FAFC',
    paper: '#FFFFFF',
    text: '#1A202C',
  },
  dark: {
    background: '#1A202C',
    paper: '#2D3748',
    text: '#F7FAFC',
  },
  opaque: {
    background: '#2C3E50',
    paper: '#34495E',
    text: '#ECF0F1',
  },
};

export const createUserTheme = (preferences: UserThemePreferences): Theme => {
  const { primaryColor, mode, fontSize, secondaryColor, borderRadius = 8, spacingLevel = 'normal' } = preferences;
  const spacingValue = spacingMap[spacingLevel];
  
  const modeColors = modeMap[mode];
  
  return createTheme({
    spacing: spacingValue,
    palette: {
      mode: mode === 'dark' || mode === 'opaque' ? 'dark' : 'light',
      primary: {
        main: primaryColor,
        contrastText: modeColors.text,
      },
      secondary: {
        main: secondaryColor || primaryColor,
        contrastText: modeColors.text,
      },
      background: {
        default: modeColors.background,
        paper: modeColors.paper,
      },
      text: {
        primary: modeColors.text,
        secondary: `${modeColors.text}CC`, // 80% opacity
      },
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: fontSizeMap[fontSize],
      h1: { 
        fontSize: fontSize === 'large' ? '3rem' : fontSize === 'medium' ? '2.5rem' : '2rem',
        fontWeight: 600,
        color: modeColors.text,
      },
      h2: { 
        fontSize: fontSize === 'large' ? '2.5rem' : fontSize === 'medium' ? '2rem' : '1.75rem',
        fontWeight: 500,
        color: modeColors.text,
      },
      body1: { 
        fontSize: fontSize === 'large' ? '1.125rem' : fontSize === 'medium' ? '1rem' : '0.875rem',
        color: modeColors.text,
      },
      body2: { 
        fontSize: fontSize === 'large' ? '1rem' : fontSize === 'medium' ? '0.875rem' : '0.75rem',
        color: `${modeColors.text}CC`,
      },
    },
    shape: {
      borderRadius,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            padding: fontSize === 'large' ? '12px 24px' : fontSize === 'medium' ? '10px 20px' : '8px 16px',
          },
          contained: {
            boxShadow: `0 8px 20px ${primaryColor}4D`, // 30% opacity
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: modeColors.paper,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: modeColors.paper,
          },
        },
      },
    },
  });
};