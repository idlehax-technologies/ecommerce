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
    Chip,
} from "@mui/material";

import { useAuth } from "@/contexts/AuthContext";
import { useActiveMembership } from "@/hooks/useActiveMembership";

function MembershipChip({
    tenantId,
    role,
    status,
}: {
    tenantId: string;
    role: string;
    status: string;
}) {
    return (
        <Chip
            label={`${tenantId} • ${role} • ${status}`}
            size="small"
            variant="outlined"
        />
    );
}

export default function Navbar({
    rightSlot,
}: {
    rightSlot?: React.ReactNode;
}) {
    const router = useRouter();
    const { user, loading, logout } = useAuth();
    const { membership, loading: mLoading } = useActiveMembership();

    async function handleLogout() {
        await logout();
        router.replace("/login");
    }

    return (
        <AppBar position="static" color="default" elevation={1}>
            <Toolbar sx={{ justifyContent: "space-between" }}>
                <Typography
                    variant="h6"
                    component={Link}
                    href="/"
                    sx={{ textDecoration: "none", color: "inherit", fontWeight: 600 }}
                >
                    TenantMart
                </Typography>

                <Stack direction="row" spacing={2} alignItems="center">
                    <Button component={Link} href="/products" color="inherit">
                        Products
                    </Button>

                    {rightSlot}

                    <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

                    {loading || mLoading ? (
                        <CircularProgress size={20} />
                    ) : user ? (
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Typography variant="body2" color="text.secondary">
                                {user.phone}
                            </Typography>

                            {membership && (
                                <MembershipChip
                                    tenantId={membership.tenantId}
                                    role={membership.role}
                                    status={membership.status}
                                />
                            )}

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