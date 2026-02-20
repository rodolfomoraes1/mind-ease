import { Typography } from '@mui/material';
import { footerStyles } from './styles';

export const Footer = () => {
  return (
    <Typography variant="caption" sx={footerStyles}>
      © 2026 Mind Ease. Hackaton Postech - FIAP Alura
    </Typography>
  );
};
