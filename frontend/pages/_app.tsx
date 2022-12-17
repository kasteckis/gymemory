import type { AppProps } from 'next/app'
import Head from "next/head";
import {createTheme, ThemeProvider} from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';
import {useEffect, useState} from "react";
import {ThemeType} from "../utils/interfaces/ThemeType";

const defaultTheme = 'dark'

export default function App({ Component, pageProps }: AppProps) {

    const [theme, setTheme] = useState<ThemeType>(defaultTheme);

    const darkTheme = createTheme({
        palette: {
            mode: theme ?? defaultTheme,
        },
    });

    useEffect(() => {
        const previousTheme = localStorage.getItem('theme') as ThemeType

        if (previousTheme) {
            setTheme(previousTheme)
        } else {
            localStorage.setItem('theme', defaultTheme)
            setTheme(defaultTheme)
        }
    })

    return <>
        <Head>
            <title>GyMemory</title>
            <meta name="description" content="GyMemory" />
            <link rel="manifest" href="/manifest.json" />
            <link rel="apple-touch-icon" href="/icons/icon-152x152.png"></link>
            <meta name="theme-color" content="#121212" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Component {...pageProps} />
        </ThemeProvider>
    </>
}
