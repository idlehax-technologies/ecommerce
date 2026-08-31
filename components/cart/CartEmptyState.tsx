"use client";

import Link from "next/link";

import {
    Container,
    Box,
    Paper,
    Stack,
    Typography,
    Button,
    Divider,
} from "@mui/material";

import ShoppingCartOutlinedIcon
    from "@mui/icons-material/ShoppingCartOutlined";

export default function CartEmptyState({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <Container maxWidth="md">
            <Stack
                spacing={2}
                sx={{ p: { xs: 0, sm: 6 } }}
            >
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        My Cart
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Your shopping cart is currently empty
                    </Typography>
                </Box>

                <Divider />

                <Paper elevation={2} sx={{ p: 2 }}>
                    <Paper
                        elevation={2}
                        sx={{
                            p: 2,
                            textAlign: "center",
                        }}
                    >
                        <Stack
                            spacing={2}
                            alignItems="center"
                        >
                            <ShoppingCartOutlinedIcon
                                sx={{
                                    fontSize: 64,
                                    color: "text.disabled",
                                }}
                            />

                            <Box>
                                <Typography variant="h6" fontWeight={600}>
                                    {title}
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    {description}
                                </Typography>
                            </Box>

                            <Button
                                variant="contained"
                                component={Link}
                                href="/home"
                            >
                                Browse Products
                            </Button>
                        </Stack>
                    </Paper>
                </Paper>
            </Stack>
        </Container>
    );
}