import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Divider, Typography, Link } from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { AuthLayout, itemVariants } from '../../components/shared/auth/AuthLayout';
import { LogoSection } from '../../components/shared/auth/LogoSection';
import { RegisterForm } from '../../components/shared/auth/RegisterForm';
import { SocialButtons } from '../../components/shared/auth/SocialButtons';
import { Footer } from '../../components/shared/auth/Footer';
import {
  cardStyles,
  cardTitleStyles,
  dividerStyles,
  dividerTextStyles,
  bottomTextStyles,
  linkStyles,
} from '../../components/shared/auth/styles';

function Register() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { registerWithEmail, loginWithGoogle, loginWithFacebook } = useAuth();

  const handleEmailRegister = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError('');
    try {
      await registerWithEmail(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      router.push('/dashboard');
    } catch {
      setError('Erro ao entrar com Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithFacebook();
      router.push('/dashboard');
    } catch {
      setError('Erro ao entrar com Facebook');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Mind Ease - Cadastro">
      <motion.div variants={itemVariants} style={{ width: '100%' }}>
        <LogoSection />
      </motion.div>

      <motion.div variants={itemVariants} style={{ width: '100%' }}>
        <Box sx={cardStyles}>
          <Typography variant="h2" sx={cardTitleStyles}>
            Crie sua conta gratuita
          </Typography>

          <RegisterForm
            onSubmit={handleEmailRegister}
            isLoading={isLoading}
            error={error}
          />

          <Divider sx={dividerStyles}>
            <Typography variant="body2" sx={dividerTextStyles}>
              ou continue com
            </Typography>
          </Divider>

          <SocialButtons
            onGoogleClick={handleGoogleLogin}
            onFacebookClick={handleFacebookLogin}
            isLoading={isLoading}
          />

          <Typography sx={bottomTextStyles}>
            Já tem uma conta?{' '}
            <Link href="/login" sx={linkStyles}>
              Faça login
            </Link>
          </Typography>
        </Box>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Footer />
      </motion.div>
    </AuthLayout>
  );
}

Register.getLayout = (page: React.ReactElement) => page;

export default Register;