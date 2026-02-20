import { DynamicThemeProvider } from '../context/ThemeContext';
import CssBaseline from '@mui/material/CssBaseline';
import type { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DynamicThemeProvider>
      <CssBaseline />
      <Component {...pageProps} />
    </DynamicThemeProvider>
  );
}
