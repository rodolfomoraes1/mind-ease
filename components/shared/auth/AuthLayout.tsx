import { ReactNode } from 'react';
import Head from 'next/head';
import { Box, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { Particles } from './Particles';
import { containerStyles, contentWrapperStyles, contentStyles, keyframes } from './styles';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box sx={containerStyles}>
        <style>{keyframes}</style>

        <Particles count={30} />

        <Container maxWidth="sm" sx={contentWrapperStyles}>
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <Box sx={contentStyles}>{children}</Box>
          </motion.div>
        </Container>
      </Box>
    </>
  );
};
