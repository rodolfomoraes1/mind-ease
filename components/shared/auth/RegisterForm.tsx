import { useState, useMemo } from 'react';
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  LinearProgress,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { formStyles, inputLabelStyles, inputStyles, primaryButtonStyles } from './styles';
import {
  validateEmail,
  validatePassword,
  validateRequired,
  getPasswordStrength,
  sanitizeName,
} from '../../../utils/validation';

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
  const [touched, setTouched] = useState({ name: false, email: false, password: false });

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);

  const fieldErrors = useMemo(() => ({
    name: touched.name ? validateRequired(name, 'Nome') : null,
    email: touched.email ? validateEmail(email) : null,
    password: touched.password ? validatePassword(password) : null,
  }), [name, email, password, touched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setTouched({ name: true, email: true, password: true });

    const nameErr = validateRequired(name, 'Nome');
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    if (nameErr || emailErr || passwordErr) {
      setLocalError(nameErr ?? emailErr ?? passwordErr ?? 'Verifique os campos');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('As senhas não coincidem');
      return;
    }

    await onSubmit(sanitizeName(name), email.trim().toLowerCase(), password);
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
        onBlur={() => setTouched((p) => ({ ...p, name: true }))}
        error={!!fieldErrors.name}
        helperText={fieldErrors.name}
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
        onBlur={() => setTouched((p) => ({ ...p, email: true }))}
        error={!!fieldErrors.email}
        helperText={fieldErrors.email}
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
        onBlur={() => setTouched((p) => ({ ...p, password: true }))}
        error={!!fieldErrors.password}
        helperText={fieldErrors.password}
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

      {password.length > 0 && (
        <Box sx={{ mt: -1 }}>
          <LinearProgress
            variant="determinate"
            value={(passwordStrength.score / 5) * 100}
            sx={{
              height: 4,
              borderRadius: 2,
              bgcolor: 'rgba(255,255,255,0.1)',
              '& .MuiLinearProgress-bar': { bgcolor: passwordStrength.color, transition: 'all 0.3s' },
            }}
          />
          <Typography variant="caption" sx={{ color: passwordStrength.color, mt: 0.25, display: 'block' }}>
            Força da senha: {passwordStrength.label}
            {passwordStrength.suggestions.length > 0 && ` — ${passwordStrength.suggestions[0]}`}
          </Typography>
        </Box>
      )}

      <TextField
        fullWidth
        label="Confirmar senha"
        type={showPassword ? 'text' : 'password'}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={confirmPassword.length > 0 && confirmPassword !== password}
        helperText={confirmPassword.length > 0 && confirmPassword !== password ? 'As senhas não coincidem' : undefined}
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
