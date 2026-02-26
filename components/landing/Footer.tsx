import { Box, Container, Typography, Link } from '@mui/material';

export const Footer = () => {
  return (
    <Box
      sx={{
        py: 4,
        backgroundColor: '#1A202C',
        borderTop: '1px solid #2D3748',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: '#A0AEC0' }}>
            © 2026 Mind Ease. Hackaton Postech - FIAP Alura
          </Typography>
          
        </Box>
      </Container>
    </Box>
  );
};