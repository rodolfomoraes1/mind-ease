import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Divider, Typography, Link } from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { AuthLayout, itemVariants } from '../../components/shared/auth/AuthLayout';
import { LogoSection } from '../../components/shared/auth/LogoSection';
import { LoginForm } from '../../components/shared/auth/LoginForm';
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

function Login() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { loginWithEmail, loginWithGoogle, loginWithFacebook } = useAuth();

  const handleEmailLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError('');
    try {
      await loginWithEmail(email, password);
      router.push('/dashboard');
    } catch {
      setError('Email ou senha inválidos');
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
      setError('Erro ao login com Google');
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
      setError('Erro ao login com Facebook');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Mind Ease - Login">
      <motion.div variants={itemVariants} style={{ width: '100%' }}>
        <LogoSection />
      </motion.div>

      <motion.div variants={itemVariants} style={{ width: '100%' }}>
        <Box sx={cardStyles}>
          <Typography variant="h2" sx={cardTitleStyles}>
            Bem-vindo
          </Typography>

          <LoginForm
            onSubmit={handleEmailLogin}
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
            Não tem uma conta?{' '}
            <Link href="/register" sx={linkStyles}>
              Cadastre-se
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

Login.getLayout = (page: React.ReactElement) => page;

export default Login;