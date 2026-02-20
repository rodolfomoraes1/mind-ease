import Head from 'next/head';
import { Box } from '@mui/material';
import { Header } from './components/Header';
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
        <Header />
        <Hero />
        <Footer />
      </Box>
    </>
  );
}