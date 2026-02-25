// app/ThemeRegistry.tsx

"use client";

import * as React from "react";
import { useState } from "react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { useServerInsertedHTML } from "next/navigation";

import {
    ThemeProvider,
    CssBaseline,
    createTheme,
} from "@mui/material";

export default function ThemeRegistry({
    children,
}: {
    children: React.ReactNode;
}) {
    const [cache] = useState(() => {
        const cache = createCache({ key: "mui", prepend: true });
        cache.compat = true;
        return cache;
    });

    useServerInsertedHTML(() => {
        const styles = cache.inserted;
        const names = Object.keys(styles);

        if (names.length === 0) return null;

        let css = "";
        for (const name of names) {
            css += styles[name];
        }

        return (
            <style
                data-emotion={`${cache.key} ${names.join(" ")}`}
                dangerouslySetInnerHTML={{ __html: css }}
            />
        );
    });

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode: "light",
                    primary: { main: "#0052cc" },
                    background: { default: "#f8fafc" },
                },
                shape: { borderRadius: 10 },
                typography: {
                    fontFamily:
                        "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
                    button: { textTransform: "none", fontWeight: 600 },
                    h4: { fontWeight: 600 },
                    subtitle1: { fontWeight: 600 },
                },
                components: {
                    MuiButton: {
                        defaultProps: { disableElevation: true },
                    },
                    MuiCard: {
                        defaultProps: { elevation: 0 },
                        styleOverrides: {
                            root: { border: "1px solid #e5e7eb" },
                        },
                    },
                    MuiTextField: {
                        defaultProps: { fullWidth: true, size: "small" },
                    },
                    MuiContainer: {
                        styleOverrides: {
                            root: { paddingTop: 16, paddingBottom: 16 },
                        },
                    },
                },
            }),
        []
    );

    return (
        <CacheProvider value={cache}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </CacheProvider>
    );
}