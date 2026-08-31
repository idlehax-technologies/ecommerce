"use client";

import {
    Grid,
    Paper,
    Stack,
    Typography,
    useTheme,
    useMediaQuery,
} from "@mui/material";

import LocalLibraryIcon
    from "@mui/icons-material/LocalLibrary";
import ShoppingBagIcon
    from "@mui/icons-material/ShoppingBag";
import Inventory2Icon
    from "@mui/icons-material/Inventory2";
import SecurityIcon
    from "@mui/icons-material/Security";

import { BRAND_COLORS } from "@/app/theme/brandColors";

const FEATURES = [
    {
        icon: <LocalLibraryIcon color="primary" fontSize="large" />,
        title: "School Essentials",
        description:
            "Browse books, stationery, uniforms, and other school supplies from your school's store.",
    },
    {
        icon: <ShoppingBagIcon color="primary" fontSize="large" />,
        title: "Easy Ordering",
        description:
            "Place your order online in just a few clicks with a simple and intuitive shopping experience.",
    },
    {
        icon: <Inventory2Icon color="primary" fontSize="large" />,
        title: "Pickup\u00A0at School",
        description:
            "Collect your order directly from your school's pickup counter at your convenience.",
    },
    {
        icon: <SecurityIcon color="primary" fontSize="large" />,
        title: "Secure Access",
        description:
            "Login securely using your registered account and access your school's personalized storefront.",
    },
];

export default function FeatureCards() {

    const theme = useTheme();
    const smUp = useMediaQuery(theme.breakpoints.up("sm"));

    return (
        <Grid
            container
            spacing={{
                xs: 2,
                sm: 4,
            }}
        >
            {FEATURES.map((feature) => (
                <Grid
                    key={feature.title}
                    size={{
                        xs: 6,
                        lg: 3,
                    }}
                >
                    <Paper
                        elevation={1}
                        sx={{
                            height: "100%",
                            p: {
                                xs: 3,
                                sm: 5,
                            },

                            bgcolor: BRAND_COLORS.lavender,
                            borderRadius: {
                                xs: 4,
                                sm: 6,
                            },

                            transition: "0.4s ease",
                            "&:hover": {
                                boxShadow: 3,
                            },
                        }}
                    >
                        <Stack
                            spacing={1}
                            alignItems={{
                                xs: "center",
                                sm: "flex-start",
                            }}
                        >
                            {feature.icon}

                            <Typography
                                variant="h5"
                                fontWeight={600}
                                sx={{
                                    fontSize: {
                                        xs: "1.25rem",
                                        sm: "1.5rem",
                                    },
                                    lineHeight: 1.2,
                                    textAlign: {
                                        xs: "center",
                                        sm: "left",
                                    },
                                }}
                            >
                                {smUp
                                    ? feature.title
                                    : (
                                        <>
                                            {feature.title.split(" ")[0]}
                                            <br />
                                            {feature.title.split(" ").slice(1).join(" ")}
                                        </>
                                    )}
                            </Typography>

                            {smUp && (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {feature.description}
                                </Typography>
                            )}
                        </Stack>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    );
}