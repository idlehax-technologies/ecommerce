"use client";

import Link from "next/link";

import {
    Stack,
    Typography,
} from "@mui/material";

export default function OtpFooter() {
    return (
        <Stack
            spacing={0.25}
            alignItems="center"
        >
            <Typography
                variant="caption"
                color="text.secondary"
                textAlign="center"
            >
                By verifying, you agree to our{" "}
                <Typography
                    component={Link}
                    href="/terms"
                    variant="inherit"
                    color="inherit"
                    sx={{
                        textDecoration: "none",
                        fontWeight: 600,
                        "&:hover": {
                            textDecoration: "underline",
                        },
                    }}
                >
                    Terms{"\u00A0"}of{"\u00A0"}Service
                </Typography>
                {" "}&{" "}
                <Typography
                    component={Link}
                    href="/privacy"
                    variant="inherit"
                    color="inherit"
                    sx={{
                        textDecoration: "none",
                        fontWeight: 600,
                        "&:hover": {
                            textDecoration: "underline",
                        },
                    }}
                >
                    Privacy{"\u00A0"}Policy
                </Typography>
            </Typography>

            <Typography
                variant="caption"
                color="text.secondary"
                textAlign="center"
            >
                Need help?{" "}
                <Typography
                    component={Link}
                    href="/contact"
                    variant="inherit"
                    color="primary"
                    sx={{
                        textDecoration: "none",
                        fontWeight: 600,
                        "&:hover": {
                            textDecoration: "underline",
                        },
                    }}
                >
                    Contact{"\u00A0"}us
                </Typography>
            </Typography>
        </Stack>
    );
}