"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Stack,
    Badge,
    Divider,
} from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

export default function Navbar() {
    const router = useRouter();
    const { user, loading, logout } = useAuth();
    const { items } = useCart();

    const cartCount = items.reduce((s, i) => s + i.quantity, 0);

    const role = user?.role;

    const isCustomer = role === "customer";
    const isTenantOperator = role === "admin" || role === "staff";
    const isSuperadmin = role === "superadmin";

    const handleLogout = async () => {
        await logout();
        router.replace("/login");
    };

    return (
        <AppBar position="static" color="default" elevation={1}>
            <Toolbar sx={{ justifyContent: "space-between" }}>
                {/* Brand */}
                <Typography
                    variant="h6"
                    component={Link}
                    href="/"
                    sx={{ textDecoration: "none", color: "inherit", fontWeight: 600 }}
                >
                    TenantMart
                </Typography>

                {/* Navigation */}
                <Stack direction="row" spacing={2} alignItems="center">
                    <Button component={Link} href="/products" color="inherit">
                        Products
                    </Button>

                    {/* Customer */}
                    {!loading && isCustomer && (
                        <Button component={Link} href="/cart" color="inherit">
                            <Badge badgeContent={cartCount} color="primary">
                                <ShoppingCartIcon />
                            </Badge>
                        </Button>
                    )}

                    {/* Staff + Admin */}
                    {!loading && isTenantOperator && (
                        <Button component={Link} href="/admin" color="inherit">
                            Admin
                        </Button>
                    )}

                    {/* Superadmin */}
                    {!loading && isSuperadmin && (
                        <Button component={Link} href="/admin/tenants" color="inherit">
                            Tenants
                        </Button>
                    )}

                    <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

                    {/* Auth */}
                    {!loading &&
                        (user ? (
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Typography variant="body2" color="text.secondary">
                                    {user.phone}
                                </Typography>

                                <Button component={Link} href="/profile" size="small">
                                    Profile
                                </Button>

                                <Button color="error" size="small" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </Stack>
                        ) : (
                            <Button component={Link} href="/login" variant="contained">
                                Login
                            </Button>
                        ))}
                </Stack>
            </Toolbar>
        </AppBar>
    );
}
