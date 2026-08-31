"use client";

import type { ElementType } from "react";

import {
    Box,
    Typography,
} from "@mui/material";

import { BRAND_LOGO_COLORS } from "@/app/theme/brandColors";
import { outfit } from "@/app/theme/fonts";

type BrandLogoProps = {
    component?: ElementType;
    size?: "small" | "medium" | "large";
    showDomain?: boolean;
};

const FONT_SIZES = {
    small: {
        xs: "1rem",
        sm: "1.25rem",
    },
    medium: {
        xs: "1.75rem",
        sm: "2.125rem",
    },
    large: {
        xs: "2.5rem",
        sm: "3rem",
    },
} as const;

const DOMAIN_FONT_SIZES = {
    small: "0.64em",
    medium: "0.58em",
    large: "0.52em",
} as const;

export default function BrandLogo({
    component = "div",
    size = "medium",
    showDomain = true,
}: BrandLogoProps) {
    return (
        <Typography
            component={component}
            sx={{
                fontFamily: outfit.style.fontFamily,
                fontWeight: 700,

                display: "inline-flex",
                alignItems: "baseline",

                fontSize: FONT_SIZES[size],

                lineHeight: 1.15,
                letterSpacing: "-0.02em",

                whiteSpace: "nowrap",
                userSelect: "none",
            }}
        >
            <Box
                component="span"
                sx={{
                    color: BRAND_LOGO_COLORS.mint,
                }}
            >
                every
            </Box>

            <Box
                component="span"
                sx={{
                    background: `linear-gradient(
                        90deg,
                        ${BRAND_LOGO_COLORS.peach},
                        ${BRAND_LOGO_COLORS.lavender}
                    )`,

                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",

                    color: "transparent",
                    WebkitTextFillColor: "transparent",

                    fontWeight: 800,
                }}
            >
                Shop
            </Box>

            {showDomain && (
                <Box
                    component="span"
                    sx={{
                        color: BRAND_LOGO_COLORS.sky,
                        fontSize: DOMAIN_FONT_SIZES[size],
                    }}
                >
                    .in
                </Box>
            )}
        </Typography>
    );
}