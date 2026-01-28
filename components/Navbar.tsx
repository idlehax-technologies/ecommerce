"use client";

import { AppBar, Box, Toolbar, Typography, Button } from '@mui/material';
import Link from 'next/link';
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
    const { user, loading, logout } = useAuth();
    const handleLogout = async () => {
        if (loading) return;
        await logout();
    };


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
                
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Button
                        color="inherit"
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

                    <Button
                        color="inherit"
                        component={Link}
                        href="/orders"
                    >
                        Orders
                    </Button>

                    {!loading && user && (
                        <>
                            <Typography
                                variant="body2"
                                sx={{ mx: 1 }}
                            >
                                {user.email}
                            </Typography>

                            <Button
                                color="inherit"
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </>
                    )}

                    {!loading && !user && (
                        <Button
                            color="inherit"
                            component={Link}
                            href="/login"
                        >
                            Login
                        </Button>
                    )}
                </Box>

            </Toolbar>
        </AppBar>
    );
}
