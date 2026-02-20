import { Box } from '@mui/material';
import { motion } from 'framer-motion';

interface ParticlesProps {
  count?: number;
}

export const Particles: React.FC<ParticlesProps> = ({ count = 30 }) => {
  const particles = Array.from({ length: count }, (_, i) => ({
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
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 1,
        top: 0,
        left: 0,
        pointerEvents: 'none',
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
          }}
        />
      ))}
    </Box>
  );
};
