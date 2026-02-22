import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { useCognitiveAlerts } from '../../hooks/useCognitiveAlerts';

/**
 * Popup (Dialog) de alerta cognitivo.
 * Dispara quando o usuário está focado por X min (info) ou 2X min (warning).
 * Controlado pelo hook useCognitiveAlerts — ativo somente se
 * cognitivePreferences.cognitiveAlerts = true.
 */
export const CognitiveAlert: React.FC = () => {
  const { alert, dismiss } = useCognitiveAlerts();

  return (
    <Dialog
      open={alert.open}
      onClose={dismiss}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
        {alert.severity === 'warning' ? '⚠️ Pausa importante' : '🧠 Hora de pausar!'}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          {alert.message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          variant="contained"
          color={alert.severity === 'warning' ? 'warning' : 'primary'}
          onClick={dismiss}
          sx={{ borderRadius: 2 }}
        >
          {alert.actionLabel ?? 'Entendido!'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
