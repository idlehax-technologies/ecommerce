"use client";

import Link from "next/link";
import Image from "next/image";

import {
    Grid,
    Stack,
    Box,
    Paper,
    Typography,
    Button,
    Chip,
    useTheme,
    useMediaQuery,
} from "@mui/material";

import ChevronRightIcon
    from "@mui/icons-material/ChevronRight";
import ArrowForwardIcon
    from "@mui/icons-material/ArrowForward";

import { BRAND_COLORS } from "@/app/theme/brandColors";
import { imageAssets } from "@/assets/assets";

export default function Hero() {

    const theme = useTheme();
    const smUp = useMediaQuery(theme.breakpoints.up("sm"));
    const mdUp = useMediaQuery(theme.breakpoints.up("md"));

    return (
        <Grid
            container
            spacing={{
                xs: 2,
                sm: 4,
            }}
        >
            <Grid
                size={{
                    xs: 12,
                    md: 8,
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        position: "relative",
                        overflow: "visible",

                        height: "100%",
                        p: {
                            xs: 3,
                            sm: 5,
                        },

                        bgcolor: BRAND_COLORS.mint,
                        borderRadius: {
                            xs: 4,
                            sm: 6,
                        },
                    }}
                >
                    <Stack
                        justifyContent="center"
                        alignItems="flex-start"

                        spacing={2}
                        sx={{
                            width: "65%",
                            height: "100%",
                        }}
                    >
                        {mdUp && (
                            <Chip
                                color="success"
                                label="Now available for schools"
                                icon={<ChevronRightIcon />}
                            />
                        )}

                        <Typography
                            variant="h3"
                            fontWeight={700}
                            sx={{
                                fontSize: {
                                    xs: "2.125rem",
                                    sm: "3rem",
                                },
                                lineHeight: 1.1,
                            }}
                        >
                            Shopping
                            <br />
                            {"made\u00A0simple"}
                        </Typography>

                        {mdUp && (
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                fontSize="1.125rem"
                            >
                                Everything your school needs—books, stationery,
                                uniforms, and more—all ready for convenient
                                pickup at your school
                            </Typography>
                        )}

                        <Button
                            component={Link}
                            href="/login"
                            variant="outlined"
                            color="inherit"
                            size={smUp ? "large" : "medium"}
                            endIcon={<ArrowForwardIcon />}
                            sx={{
                                px: {
                                    xs: 1.25,
                                    sm: 1.5,
                                },
                                borderRadius: 1.5,
                            }}
                        >
                            Login
                        </Button>
                    </Stack>

                    <Box
                        sx={{
                            position: "absolute",

                            right: 0,
                            bottom: 0,

                            width: "50%",

                            display: "flex",
                            justifyContent: "center",

                            zIndex: 1,
                            pointerEvents: "none",
                        }}
                    >
                        <Image
                            src={imageAssets.hero_model}
                            alt=""
                            style={{
                                width: "100%",
                                height: "auto",
                            }}
                            priority
                        />
                    </Box>
                </Paper>
            </Grid>

            <Grid
                size={{
                    xs: 12,
                    md: 4,
                }}
            >
                <Stack
                    direction={{
                        xs: "row",
                        md: "column",
                    }}
                    spacing={{
                        xs: 2,
                        sm: 4,
                    }}
                    height="100%"
                >
                    <Box sx={{ flex: 1 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                position: "relative",
                                overflow: "visible",

                                height: "100%",
                                p: {
                                    xs: 3,
                                    sm: 5,
                                },

                                bgcolor: BRAND_COLORS.peach,
                                borderRadius: {
                                    xs: 4,
                                    sm: 6,
                                },
                            }}
                        >
                            <Stack
                                justifyContent="center"
                                alignItems="flex-start"

                                spacing={1}
                                sx={{
                                    width: "65%",
                                    height: "100%",
                                }}
                            >
                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                    sx={{
                                        fontSize: {
                                            xs: "1.5rem",
                                            sm: "2.125rem",
                                        },
                                        lineHeight: 1.1,
                                    }}
                                >
                                    School
                                    <br />
                                    Store
                                </Typography>

                                <Button
                                    component={Link}
                                    href="/login"
                                    color="inherit"
                                    size={smUp ? "medium" : "small"}
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{
                                        px: 0,
                                    }}
                                >
                                    Login
                                </Button>
                            </Stack>

                            <Box
                                sx={{
                                    position: "absolute",

                                    top: "50%",
                                    right: 0,

                                    width: "50%",

                                    transform: "translateY(-50%)",

                                    display: "flex",
                                    justifyContent: "center",

                                    zIndex: 1,
                                    pointerEvents: "none",
                                }}
                            >
                                <Image
                                    src={imageAssets.hero_product_1}
                                    alt=""
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                    }}
                                    priority
                                />
                            </Box>
                        </Paper>
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                position: "relative",
                                overflow: "visible",

                                height: "100%",
                                p: {
                                    xs: 3,
                                    sm: 5,
                                },

                                bgcolor: BRAND_COLORS.sky,
                                borderRadius: {
                                    xs: 4,
                                    sm: 6,
                                },
                            }}
                        >
                            <Stack
                                justifyContent="center"
                                alignItems="flex-start"

                                spacing={1}
                                sx={{
                                    width: "65%",
                                    height: "100%",
                                }}
                            >
                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                    sx={{
                                        fontSize: {
                                            xs: "1.5rem",
                                            sm: "2.125rem",
                                        },
                                        lineHeight: 1.1,
                                    }}
                                >
                                    Fast
                                    <br />
                                    Pickup
                                </Typography>

                                <Button
                                    component={Link}
                                    href="/login"
                                    color="inherit"
                                    size={smUp ? "medium" : "small"}
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{
                                        px: 0,
                                    }}
                                >
                                    Login
                                </Button>
                            </Stack>

                            <Box
                                sx={{
                                    position: "absolute",

                                    top: "50%",
                                    right: 0,

                                    width: "50%",

                                    transform: "translateY(-50%)",

                                    display: "flex",
                                    justifyContent: "center",

                                    zIndex: 1,
                                    pointerEvents: "none",
                                }}
                            >
                                <Image
                                    src={imageAssets.hero_product_2}
                                    alt=""
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                    }}
                                    priority
                                />
                            </Box>
                        </Paper>
                    </Box>
                </Stack>
            </Grid>
        </Grid>
    );
}