import React, { useState } from 'react';
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useUserInfo } from '../../hooks/useUserInfo';

export type CardType = 'userInfo' | 'charts' | 'kanban';

interface CardTourButtonProps {
  cardType: CardType;
  title: string;
  description: string;
  tips?: string[];
}

/**
 * Botão "?" por card que explica a funcionalidade em um Dialog.
 * Visibilidade por perfil:
 *   - beginner     → aparece em todos os cards
 *   - intermediate → apenas no card do Kanban
 *   - advanced     → nunca aparece
 */
export const CardTourButton: React.FC<CardTourButtonProps> = ({
  cardType,
  title,
  description,
  tips,
}) => {
  const { userInfo } = useUserInfo();
  const [open, setOpen] = useState(false);

  const profile = userInfo?.navigationProfile ?? 'intermediate';

  const shouldShow =
    profile === 'beginner' ||
    (profile === 'intermediate' && cardType === 'kanban');

  if (!shouldShow) return null;

  return (
    <>
      <Tooltip title="O que é este card?" arrow>
        <IconButton
          size="small"
          onClick={(e) => { e.stopPropagation(); setOpen(true); }}
          sx={{
            color: 'primary.main',
            opacity: 0.6,
            flexShrink: 0,
            transition: 'all 0.2s',
            '&:hover': { opacity: 1, bgcolor: 'primary.main', color: 'white' },
          }}
        >
          <HelpOutlineIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>{title}</DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: tips?.length ? 2 : 0 }}>
            {description}
          </Typography>
          {tips && tips.length > 0 && (
            <List dense disablePadding>
              {tips.map((tip, i) => (
                <ListItem key={i} disableGutters>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <CheckCircleOutlineIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={tip}
                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="contained" onClick={() => setOpen(false)} sx={{ borderRadius: 2 }}>
            Entendido! 👍
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
