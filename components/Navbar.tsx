"use client";

import { AppBar, Box, Toolbar, Typography, Button } from '@mui/material';
import Link from 'next/link';
import { useCart } from "@/context/CartContext";

export default function Navbar() {
    const { items } = useCart();

    const totalItems = items.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography
                    variant="h6"
                    sx={{ flexGrow: 1 }}
                >
                    ECOMMERCE
                </Typography>
                <Box>
                    <Button
                        color='inherit'
                        component={Link}
                        href="/"
                    >
                        Home
                    </Button>
                    <Button
                        color="inherit"
                        component={Link}
                        href="/cart"
                    >
                        Cart ({totalItems})
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
