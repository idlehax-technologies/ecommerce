"use client";

import type { ReactNode } from "react";

import {
    Box,
    Stack,
    Paper,
    Typography,
} from "@mui/material";

import BrandLogo from "../layout/BrandLogo";

type AuthCardProps = {
    title: string;
    subtitle: string;
    children: ReactNode;
    headerStart?: ReactNode;
};

export default function AuthCard({
    title,
    subtitle,
    children,
    headerStart,
}: AuthCardProps) {
    return (
        <Paper
            elevation={0}
            sx={{
                width: {
                    xs: "100%",
                    sm: 420,
                },
                p: {
                    xs: 3,
                    sm: 4,
                },
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
            }}
        >
            <Stack
                spacing={{
                    xs: 2,
                    sm: 3,
                }}
            >
                <Stack
                    spacing={{
                        xs: 0.25,
                        sm: 0.75,
                    }}
                    alignItems="center"
                >
                    <Box
                        sx={{
                            position: "relative",
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        {headerStart && (
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: 0,
                                    transform: "translateY(-50%)",
                                }}
                            >
                                {headerStart}
                            </Box>
                        )}

                        <BrandLogo
                            component="h1"
                            size="medium"
                        />
                    </Box>

                    <Stack
                        spacing={{
                            xs: 0,
                            sm: 0.25,
                        }}
                        alignItems="center"
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                textAlign: "center",
                                fontWeight: 600,
                                fontSize: {
                                    xs: "1.25rem", // h6
                                    sm: "1.5rem",  // h5
                                },
                            }}
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{
                                textAlign: "center",
                                fontSize: {
                                    xs: "0.875rem", // body2
                                    sm: "1rem",     // body1
                                },
                            }}
                        >
                            {subtitle}
                        </Typography>
                    </Stack>
                </Stack>

                {children}
            </Stack>
        </Paper>
    );
}