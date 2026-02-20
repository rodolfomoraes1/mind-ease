import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  logoSectionStyles,
  logoContainerStyles,
  titleStyles
} from './styles';

export const LogoSection = () => {
  return (
    <Box sx={logoSectionStyles}>
      <motion.div
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
      >
        <Box sx={logoContainerStyles}>
          <Image
            src="/images/logo/icone-512-512.svg"
            alt="Mind Ease Logo"
            width={80}
            height={80}
            priority
          />
        </Box>
      </motion.div>
      <Typography variant="h1" sx={titleStyles}>
        Mind Ease
      </Typography>
    </Box>
  );
};
