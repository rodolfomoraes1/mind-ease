import { Tooltip, IconButton, Chip } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useTour } from '../../hooks/useTour';
import { useUserInfo } from '../../hooks/useUserInfo';

/**
 * Botão de tour guiado.
 * Exibido para perfil 'beginner' ou quando o tour ainda não foi concluído.
 */
export const TourButton: React.FC = () => {
  const { userInfo } = useUserInfo();
  const { startTour, isTourCompleted } = useTour();

  // Mostra para iniciantes ou se o tour ainda não foi feito
  const shouldShow =
    userInfo?.navigationProfile === 'beginner' || !isTourCompleted();

  if (!userInfo || !shouldShow) return null;

  return (
    <Tooltip title="Tour guiado — aprenda a usar o Mind Ease" arrow>
      <Chip
        id="tour-settings"
        icon={<HelpOutlineIcon sx={{ fontSize: 16 }} />}
        label="Tour"
        size="small"
        onClick={() => startTour()}
        sx={{
          cursor: 'pointer',
          fontWeight: 600,
          bgcolor: 'primary.main',
          color: 'white',
          '&:hover': { bgcolor: 'primary.dark' },
          '& .MuiChip-icon': { color: 'white' },
        }}
      />
    </Tooltip>
  );
};
