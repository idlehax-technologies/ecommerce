"use client";

import {
    createTheme,
    ThemeProvider,
    CssBaseline,
} from "@mui/material";
import { ReactNode, useMemo } from "react";

export default function CustomStyles({
    children,
}: {
    children: ReactNode;
}) {
    // useMemo prevents recreating theme every render
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: "light",

                    primary: {
                        main: "#0052cc",
                    },

                    background: {
                        default: "#f8fafc",
                    },
                },

                shape: {
                    borderRadius: 10,
                },

                typography: {
                    fontFamily:
                        "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",

                    button: {
                        textTransform: "none", // ❌ REMOVE UPPERCASE
                        fontWeight: 600,
                    },

                    h4: {
                        fontWeight: 600,
                    },

                    subtitle1: {
                        fontWeight: 600,
                    },
                },

                components: {
                    /* ---------- Buttons ---------- */
                    MuiButton: {
                        defaultProps: {
                            disableElevation: true,
                        },
                    },

                    /* ---------- Cards ---------- */
                    MuiCard: {
                        defaultProps: {
                            elevation: 0,
                        },
                        styleOverrides: {
                            root: {
                                border: "1px solid #e5e7eb",
                            },
                        },
                    },

                    /* ---------- TextField ---------- */
                    MuiTextField: {
                        defaultProps: {
                            fullWidth: true,
                            size: "small",
                        },
                    },

                    /* ---------- Container spacing ---------- */
                    MuiContainer: {
                        styleOverrides: {
                            root: {
                                paddingTop: 16,
                                paddingBottom: 16,
                            },
                        },
                    },
                },
            }),
        []
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}



// "use client";

// import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

// const theme = createTheme({
//     palette: {
//         primary: {
//             main: '#0052cc',
//         },
//         // secondary: {
//         //     main: '#edf2ff',
//         // },
//     },
// });

// export default function CustomStyles({ children }: { children: React.ReactNode }) {
//     return (
//         <ThemeProvider theme={theme}>
//             <CssBaseline />
//             {children}
//         </ThemeProvider>
//     );
// }