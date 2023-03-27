import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Alert, createTheme, Snackbar, ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect, useState } from 'react';
import { ThemeType } from '../utils/interfaces/ThemeType';
import { GlobalAlert } from '../utils/interfaces/GlobalAlert';
import { apiClient } from '../utils/apiClient';

const defaultTheme = 'dark';

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState<ThemeType>(defaultTheme);
  const [alert, setAlert] = useState<GlobalAlert>({ open: false, message: '', severity: 'info' });

  const handleCloseAlert = () => {
    setAlert({
      ...alert,
      open: false,
    });
  };

  const darkTheme = createTheme({
    palette: {
      mode: theme ?? defaultTheme,
    },
  });

  useEffect(() => {
    const previousTheme = localStorage.getItem('theme') as ThemeType;

    if (previousTheme) {
      setTheme(previousTheme);
    } else {
      localStorage.setItem('theme', defaultTheme);
      setTheme(defaultTheme);
    }
  }, [setTheme]);

  apiClient.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      switch (error.response.status) {
        case 403:
          setAlert({
            open: true,
            message: 'Unauthorized!',
            severity: 'error',
          });
          break;
        default:
          setAlert({
            open: true,
            message: error.response.data.message,
            severity: 'error',
          });
      }

      return Promise.reject(error);
    },
  );

  return (
    <>
      <Head>
        <title>Home | GyMemory</title>
        <meta name="description" content="GyMemory" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png"></link>
        <meta name="theme-color" content="#121212" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider theme={darkTheme}>
        <Snackbar
          open={alert.open}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
            {alert.message}
          </Alert>
        </Snackbar>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
