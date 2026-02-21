import { DynamicThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { AppLayout } from '../components/shared/AppLayout';
import CssBaseline from '@mui/material/CssBaseline';
import type { AppProps } from 'next/app';
import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';

export type NextPageWithLayout<P = object> = NextPage<P> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ?? ((page: ReactElement) => <AppLayout>{page}</AppLayout>);

  return (
    <AuthProvider>
      <DynamicThemeProvider>
        <CssBaseline />
        {getLayout(<Component {...pageProps} />)}
      </DynamicThemeProvider>
    </AuthProvider>
  );
}
