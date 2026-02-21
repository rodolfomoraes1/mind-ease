import React from 'react';
import Head from 'next/head';
import { Box, Toolbar } from '@mui/material';
import { AppHeader } from '../../components/shared/AppHeader';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';

export default function Landing() {
  return (
    <>
      <Head>
        <title>Mind Ease</title>
        <meta name="description" content="Mind Ease" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box sx={{ overflowX: 'hidden' }}>
        <AppHeader />
        <Toolbar sx={{ py: 1 }} />
        <Hero />
        <Footer />
      </Box>
    </>
  );
}

Landing.getLayout = (page: React.ReactElement) => page;