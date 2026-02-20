import { SxProps, Theme } from '@mui/material';

export const containerStyles: SxProps<Theme> = {
  minHeight: '100vh',
  width: '100%',
  position: 'relative',
  background: 'linear-gradient(-45deg, #667eea, #764ba2, #6b8cff, #9f7aea)',
  backgroundSize: '400% 400%',
  animation: 'gradient 15s ease infinite',
  overflowY: 'auto',
  overflowX: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  py: 4,
  '@keyframes gradient': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },
};

export const contentWrapperStyles: SxProps<Theme> = {
  position: 'relative',
  zIndex: 2,
  width: '100%',
  maxWidth: '450px',
  mx: 'auto',
  px: 2,
};

export const contentStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 3,
  width: '100%',
};

export const logoSectionStyles: SxProps<Theme> = {
  textAlign: 'center',
  color: 'white',
  width: '100%',
  mb: 1,
};

export const logoContainerStyles: SxProps<Theme> = {
  display: 'inline-block',
  mb: 1,
  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
};

export const titleStyles: SxProps<Theme> = {
  fontSize: { xs: '1.8rem', sm: '2rem' },
  fontWeight: 700,
  mb: 0.5,
  textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
  letterSpacing: '-0.5px',
};

export const subtitleStyles: SxProps<Theme> = {
  fontSize: { xs: '0.9rem', sm: '0.95rem' },
  opacity: 0.9,
  fontWeight: 300,
  letterSpacing: '0.5px',
};

export const cardStyles: SxProps<Theme> = {
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: 3,
  p: { xs: 3, sm: 4 },
  width: '100%',
  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  transition: 'all 0.3s ease',
};

export const cardTitleStyles: SxProps<Theme> = {
  fontSize: { xs: '1.3rem', sm: '1.5rem' },
  color: 'white',
  mb: 3,
  textAlign: 'center',
  fontWeight: 500,
};

export const formStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  mb: 3,
};

export const inputLabelStyles = {
  color: 'rgba(255,255,255,0.7)',
  '&.Mui-focused': {
    color: 'white',
  },
};

export const inputStyles = {
  '& .MuiOutlinedInput-root': {
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    '& fieldset': {
      borderColor: 'rgba(255,255,255,0.2)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255,255,255,0.4)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    },
  },
};

export const primaryButtonStyles: SxProps<Theme> = {
  mt: 1,
  py: 1.5,
  background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
  color: 'white',
  fontWeight: 600,
  fontSize: '1rem',
  borderRadius: 2,
  '&:hover': {
    background: 'linear-gradient(135deg, #5A67D8 0%, #6B46A0 100%)',
  },
  '&:disabled': {
    background: 'rgba(102, 126, 234, 0.5)',
  },
};

export const dividerStyles: SxProps<Theme> = {
  my: 2,
  '&::before, &::after': {
    borderColor: 'rgba(255,255,255,0.2)',
  },
};

export const dividerTextStyles: SxProps<Theme> = {
  color: 'rgba(255,255,255,0.7)',
  fontSize: '0.85rem',
  px: 2,
};

export const socialButtonsContainerStyles: SxProps<Theme> = {
  display: 'flex',
  gap: 2,
  mb: 2,
};

export const socialButtonStyles: SxProps<Theme> = {
  flex: 1,
  color: 'white',
  borderColor: 'rgba(255,255,255,0.3)',
  py: 1.2,
  fontSize: '0.9rem',
  '&:hover': {
    borderColor: 'white',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
};

export const bottomTextStyles: SxProps<Theme> = {
  textAlign: 'center',
  color: 'rgba(255,255,255,0.8)',
  fontSize: '0.9rem',
  mb: 1,
};

export const linkStyles: SxProps<Theme> = {
  color: 'white',
  fontWeight: 600,
  textDecoration: 'none',
  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline',
  },
};

export const forgotPasswordStyles: SxProps<Theme> = {
  display: 'block',
  textAlign: 'center',
  color: 'rgba(255,255,255,0.6)',
  fontSize: '0.85rem',
  textDecoration: 'none',
  cursor: 'pointer',
  '&:hover': {
    color: 'white',
  },
};

export const footerStyles: SxProps<Theme> = {
  mt: 2,
  color: 'rgba(255,255,255,0.4)',
  fontSize: '0.75rem',
  textAlign: 'center',
};

export const keyframes = `
  @keyframes float {
    0% { transform: translateY(0) translateX(0); opacity: 0; }
    25% { opacity: 0.6; }
    50% { transform: translateY(-80px) translateX(80px); opacity: 0.4; }
    75% { opacity: 0.6; }
    100% { transform: translateY(-160px) translateX(160px); opacity: 0; }
  }
`;
