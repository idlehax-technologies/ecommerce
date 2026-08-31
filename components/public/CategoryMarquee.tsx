"use client";

import Link from "next/link";

import {
    Box,
    Stack,
    Chip,
} from "@mui/material";

const REPEAT_COUNT = 4;

const CATEGORIES = [
    "Books",
    "Stationery",
    "Uniforms",
    "Sports",
    "Electronics",
    "Art Supplies",
    "Lab Equipment",
    "School Bags",
];

export default function CategoryMarquee() {

    const items = Array.from({ length: REPEAT_COUNT }).flatMap(
        () => CATEGORIES
    );

    return (
        <Box
            sx={{
                position: "relative",
                overflow: "hidden",
                py: {
                    xs: 2,
                    sm: 4,
                },
                userSelect: "none",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: {
                        xs: 48,
                        sm: 96,
                    },
                    height: "100%",
                    zIndex: 1,
                    pointerEvents: "none",
                    background: (theme) =>
                        `linear-gradient(to right, ${theme.palette.background.default}, transparent)`,
                }}
            />

            <Stack
                direction="row"
                spacing={{
                    xs: 1,
                    sm: 2,
                }}
                sx={{
                    width: "max-content",
                    animation: "categoryMarquee 30s linear infinite",
                    "@keyframes categoryMarquee": {
                        from: {
                            transform: "translateX(0)",
                        },
                        to: {
                            transform: "translateX(-25%)",
                        },
                    },
                    "&:hover": {
                        animationPlayState: "paused",
                    },
                }}
            >
                {items.map((category, index) => (
                    <Chip
                        key={index}
                        component={Link}
                        href="/login"
                        clickable
                        label={category}
                        variant="outlined"
                        sx={{
                            bgcolor: "background.paper",
                            transition: "0.25s",
                        }}
                    />
                ))}
            </Stack>

            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: {
                        xs: 48,
                        sm: 96,
                    },
                    height: "100%",
                    zIndex: 1,
                    pointerEvents: "none",
                    background: (theme) =>
                        `linear-gradient(to left, ${theme.palette.background.default}, transparent)`,
                }}
            />
        </Box>
    );
}