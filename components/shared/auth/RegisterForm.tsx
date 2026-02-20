import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { formStyles, inputLabelStyles, inputStyles, primaryButtonStyles } from './styles';

interface RegisterFormProps {
  onSubmit: (name: string, email: string, password: string) => Promise<void>;
  isLoading: boolean;
  error: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading, error }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (password !== confirmPassword) {
      setLocalError('As senhas não coincidem');
      return;
    }

    await onSubmit(name, email, password);
  };

  const displayError = localError || error;

  return (
    <Box component="form" onSubmit={handleSubmit} sx={formStyles}>
      <AnimatePresence>
        {displayError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {displayError}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <TextField
        fullWidth
        label="Nome completo"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        variant="outlined"
        InputLabelProps={{ sx: inputLabelStyles }}
        sx={inputStyles}
      />

      <TextField
        fullWidth
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        variant="outlined"
        InputLabelProps={{ sx: inputLabelStyles }}
        sx={inputStyles}
      />

      <TextField
        fullWidth
        label="Senha"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        variant="outlined"
        InputLabelProps={{ sx: inputLabelStyles }}
        sx={inputStyles}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                sx={{ color: 'rgba(255,255,255,0.7)' }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        label="Confirmar senha"
        type={showPassword ? 'text' : 'password'}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        variant="outlined"
        InputLabelProps={{ sx: inputLabelStyles }}
        sx={inputStyles}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={isLoading}
        sx={primaryButtonStyles}
      >
        {isLoading ? (
          <CircularProgress size={24} sx={{ color: 'white' }} />
        ) : (
          'Criar conta'
        )}
      </Button>
    </Box>
  );
};
