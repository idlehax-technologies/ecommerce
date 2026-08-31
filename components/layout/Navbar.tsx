"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
    Box,
    Stack,
    AppBar,
    Toolbar,
    Typography,
    Button,
    Chip,
    IconButton,
    Tooltip,
    Divider,
    CircularProgress,
    capitalize,
} from "@mui/material";

import ReceiptLongIcon
    from "@mui/icons-material/ReceiptLong";
import PersonIcon
    from "@mui/icons-material/Person";
import LogoutIcon
    from "@mui/icons-material/Logout";

import BrandLogo from "./BrandLogo";

import { useAuth } from "@/contexts/AuthContext";
import { useActiveMembership } from "@/hooks/useActiveMembership";

import { getTenant } from "@/lib/api/tenants";
import { stopAssume } from "@/lib/api/auth";

import {
    getMembershipLandingPage,
    getSuperadminLandingPage,
    getNoMembershipLandingPage,
    getUnauthenticatedLandingPage,
} from "@/lib/navigation/defaultLandingPage";

import type { Tenant } from "@/types/tenant";

function MembershipChip({
    tenantName,
    role,
}: {
    tenantName: string;
    role: string;
}) {
    return (
        <Chip
            label={`${tenantName} • ${capitalize(role)}`}
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
    const { user, loading, logout } = useAuth();
    const { membership, loading: membershipLoading } = useActiveMembership();

    const [tenant, setTenant] = useState<Tenant | null>(null);

    const brandHref = (() => {

        if (loading || membershipLoading) {
            return "/";
        }

        if (!user) {
            return getUnauthenticatedLandingPage();
        }

        if (user.isSuperadmin) {
            return getSuperadminLandingPage();
        }

        if (!membership) {
            return getNoMembershipLandingPage();
        }

        return getMembershipLandingPage(membership.role);

    })();

    async function handleLogout() {
        await logout();
    }

    async function handleStopAssume() {
        await stopAssume();
        window.location.href = getSuperadminLandingPage();
    }

    useEffect(() => {

        if (!user || !membership) {
            setTenant(null);
            return;
        }

        getTenant()
            .then((res) => {
                setTenant(res.tenant);
            })
            .catch(() => {
                setTenant(null);
            });

    }, [user, membership]);

    return (
        <AppBar position="sticky" color="default" elevation={1}>
            <Toolbar
                sx={{
                    minHeight: { xs: 56, sm: 64 },
                    justifyContent: "space-between",
                }}
            >
                <Box
                    component={Link}
                    href={brandHref}
                    sx={{
                        display: "inline-flex",
                        pr: 2,
                        textDecoration: "none",
                    }}
                >
                    <BrandLogo
                        component="span"
                        size="small"
                    />
                </Box>

                <Stack
                    direction="row"
                    spacing={{ xs: 0, sm: 2 }}
                    alignItems="center"
                >
                    {!membershipLoading &&
                        membership?.role === "customer" && (
                            <>
                                {rightSlot}

                                <Tooltip title="Orders">
                                    <IconButton
                                        component={Link}
                                        href="/orders"
                                        size="small"
                                        color="inherit"
                                    >
                                        <ReceiptLongIcon />
                                    </IconButton>
                                </Tooltip>

                                <Divider orientation="vertical" flexItem />
                            </>
                        )}

                    {loading || membershipLoading ? (
                        <CircularProgress size={20} />
                    ) : user ? (
                        <Stack
                            direction="row"
                            spacing={{ xs: 0, sm: 2 }}
                            alignItems="center"
                        >
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ px: { xs: 1, sm: 0 } }}
                            >
                                {user.phone}
                            </Typography>

                            {tenant && membership &&
                                membership.role !== "customer" && (
                                    <Box sx={{ pr: { xs: 1, sm: 0 } }}>
                                        <MembershipChip
                                            tenantName={tenant.name}
                                            role={membership.role}
                                        />
                                    </Box>
                                )}

                            <Divider orientation="vertical" flexItem />

                            {user.impersonatedBy && (
                                <Button
                                    color="warning"
                                    size="small"
                                    variant="outlined"
                                    onClick={handleStopAssume}
                                >
                                    Stop Assume
                                </Button>
                            )}

                            {!user.isSuperadmin && (
                                <Tooltip title="Profile">
                                    <IconButton
                                        component={Link}
                                        href="/profile"
                                        size="small"
                                        color="inherit"
                                    >
                                        <PersonIcon />
                                    </IconButton>
                                </Tooltip>
                            )}

                            <Tooltip title="Logout">
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={handleLogout}
                                >
                                    <LogoutIcon />
                                </IconButton>
                            </Tooltip>
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