"use client";

import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

const theme = createTheme({
    palette: {
        primary: {
            main: '#0052cc',
        },
        // secondary: {
        //     main: '#edf2ff',
        // },
    },
});

export default function CustomStyles({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}