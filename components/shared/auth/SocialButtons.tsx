import { Box, Button } from '@mui/material';
import { Google } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { socialButtonsContainerStyles, socialButtonStyles } from './styles';

interface SocialButtonsProps {
  onGoogleClick: () => Promise<void>;
  isLoading: boolean;
}

export const SocialButtons: React.FC<SocialButtonsProps> = ({
  onGoogleClick,
  isLoading,
}) => {
  return (
    <Box sx={socialButtonsContainerStyles}>
      <motion.div style={{ flex: 1 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={onGoogleClick}
          disabled={isLoading}
          startIcon={<Google />}
          sx={socialButtonStyles}
        >
          Google
        </Button>
      </motion.div>
    </Box>
  );
};
