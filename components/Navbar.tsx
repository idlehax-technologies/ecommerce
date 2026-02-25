"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Stack,
    Divider,
    CircularProgress,
} from "@mui/material";

import { useAuth } from "@/contexts/AuthContext";

/**
 * Global Navbar
 * - Safe to render everywhere (admin + tenant + login).
 * - Does NOT assume CartProvider exists.
 * - Tenant features are injected via `rightSlot`.
 */
export default function Navbar({
    rightSlot,
}: {
    rightSlot?: React.ReactNode;
}) {
    const router = useRouter();
    const { user, loading, logout } = useAuth();

    const role = user?.role;

    const isTenantOperator = role === "admin" || role === "staff";
    const isSuperadmin = role === "superadmin";

    async function handleLogout() {
        await logout();
        router.replace("/login");
    }

    return (
        <AppBar position="static" color="default" elevation={1}>
            <Toolbar sx={{ justifyContent: "space-between" }}>
                {/* Brand */}
                <Typography
                    variant="h6"
                    component={Link}
                    href="/"
                    sx={{
                        textDecoration: "none",
                        color: "inherit",
                        fontWeight: 600,
                    }}
                >
                    TenantMart
                </Typography>

                {/* Navigation */}
                <Stack direction="row" spacing={2} alignItems="center">
                    <Button component={Link} href="/products" color="inherit">
                        Products
                    </Button>

                    {/* Tenant/Admin Navigation */}
                    {!loading && isTenantOperator && (
                        <Button component={Link} href="/admin" color="inherit">
                            Admin
                        </Button>
                    )}

                    {/* Platform Navigation */}
                    {!loading && isSuperadmin && (
                        <Button component={Link} href="/admin/tenants" color="inherit">
                            Tenants
                        </Button>
                    )}

                    {/* Injected tenant runtime UI (cart, etc.) */}
                    {rightSlot}

                    <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

                    {/* Auth Section */}
                    {loading ? (
                        <CircularProgress size={20} />
                    ) : user ? (
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
                    )}
                </Stack>
            </Toolbar>
        </AppBar>
    );
}