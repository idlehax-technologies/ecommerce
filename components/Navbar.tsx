"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Badge,
    Stack,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

export default function Navbar() {
    const router = useRouter();

    const { user, loading, logout } = useAuth();
    const { items } = useCart();

    const cartCount = items.reduce((s, i) => s + i.quantity, 0);

    const handleLogout = async () => {
        await logout();
        router.replace("/login");
    };

    return (
        <AppBar position="static" color="default" elevation={1}>
            <Toolbar sx={{ justifyContent: "space-between" }}>
                {/* Left: Brand */}
                <Typography
                    variant="h6"
                    component={Link}
                    href="/"
                    sx={{ textDecoration: "none", color: "inherit" }}
                >
                    SchoolMart
                </Typography>

                {/* Right: Actions */}
                <Stack direction="row" spacing={2} alignItems="center">
                    <Button component={Link} href="/products" color="inherit">
                        Products
                    </Button>

                    <Button component={Link} href="/cart" color="inherit">
                        <Badge badgeContent={cartCount} color="primary">
                            <ShoppingCartIcon />
                        </Badge>
                    </Button>

                    {!loading && (
                        user ? (
                            <>
                                <Typography variant="body2" color="text.secondary">
                                    {user.email}
                                </Typography>

                                <Button color="error" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Button component={Link} href="/login" variant="contained">
                                Login
                            </Button>
                        )
                    )}
                </Stack>
            </Toolbar>
        </AppBar>
    );
}
