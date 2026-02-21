'use client';

import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface BackgroundAnimationProps {
  disabled?: boolean;
}

export const BackgroundAnimation: React.FC<BackgroundAnimationProps> = ({ disabled = false }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (disabled) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          background: '#f5f5f5',
        }}
      />
    );
  }

  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 15 + 8,
    delay: Math.random() * 5,
  }));

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        background: 'linear-gradient(-45deg, #667eea, #764ba2, #6b8cff, #9f7aea)',
        backgroundSize: '400% 400%',
        animation: disabled ? 'none' : 'gradient 15s ease infinite',
        overflow: 'hidden',
        '@keyframes gradient': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        '@keyframes float': {
          '0%': { transform: 'translateY(0) translateX(0)', opacity: 0 },
          '25%': { opacity: 0.6 },
          '50%': { transform: 'translateY(-80px) translateX(80px)', opacity: 0.4 },
          '75%': { opacity: 0.6 },
          '100%': { transform: 'translateY(-160px) translateX(160px)', opacity: 0 },
        },
      }}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ opacity: 0 }}
          animate={{
            y: [0, -80, -160],
            x: [0, 80, 160],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
      ))}
    </Box>
  );
};