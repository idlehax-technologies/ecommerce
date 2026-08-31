"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    Box,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    CircularProgress,
} from "@mui/material";

import { useAuth } from "@/contexts/AuthContext";
import { useActiveMembership } from "@/hooks/useActiveMembership";

import {
    PLATFORM_SIDEBAR_ITEMS,
    TENANT_SIDEBAR_ITEMS,
} from "@/lib/navigation/sidebarItems";

export default function Sidebar() {

    const pathname = usePathname();

    const {
        user,
        loading,
    } = useAuth();

    const {
        membership,
        loading: membershipLoading,
    } = useActiveMembership();

    if (
        loading ||
        membershipLoading
    ) {
        return <CircularProgress />;
    }

    const items =
        user?.isSuperadmin
            ? PLATFORM_SIDEBAR_ITEMS
            : membership &&
                membership.role !== "customer"
                ? TENANT_SIDEBAR_ITEMS[membership.role]
                : null;

    if (!items) {
        return null;
    }

    return (
        <Box
            sx={{
                width: 224,
                borderRight: 1,
                borderColor: "divider",
                flexShrink: 0,
            }}
        >
            <Box
                sx={{
                    position: "sticky",
                    top: { xs: 56, sm: 64 },
                    zIndex: (theme) =>
                        theme.zIndex.appBar - 1,
                }}
            >
                <List>
                    {items.map((item) => {
                        const Icon = item.icon;

                        return (
                            <ListItemButton
                                key={item.href}
                                component={Link}
                                href={item.href}
                                selected={
                                    pathname === item.href
                                }
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 40,
                                    }}
                                >
                                    <Icon />
                                </ListItemIcon>

                                <ListItemText
                                    primary={item.label}
                                />
                            </ListItemButton>
                        );
                    })}
                </List>
            </Box>
        </Box>
    );
}