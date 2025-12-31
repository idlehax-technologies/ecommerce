"use client";

import { AppBar, Box, Toolbar, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function Navbar() {
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
                        color='inherit'
                        component={Link}
                        href="/cart"
                    >
                        Cart
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
