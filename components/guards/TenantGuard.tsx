"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";

import { useAuth } from "@/contexts/AuthContext";
import { useActiveMembership } from "@/hooks/useActiveMembership";

import type { MembershipRole } from "@/types/membership";

type Props = {
    allowRoles?: MembershipRole[];
    children: React.ReactNode;
};

export default function TenantGuard({
    allowRoles,
    children,
}: Props) {
    const router = useRouter();

    const { user, loading } = useAuth();
    const {
        membership,
        loading: membershipLoading,
    } = useActiveMembership();

    const authorized =
        !!user &&
        !user.isSuperadmin &&
        !!membership &&
        (
            !allowRoles ||
            allowRoles.includes(membership.role)
        );

    useEffect(() => {
        if (loading || membershipLoading) {
            return;
        }

        // not logged in
        if (!user) {
            router.replace("/login");
            return;
        }

        // superadmin belongs to platform plane
        if (user.isSuperadmin) {
            router.replace("/platform/tenants");
            return;
        }

        // authenticated but no approved membership
        if (!membership) {
            router.replace("/profile");
            return;
        }

        // role mismatch
        if (
            allowRoles &&
            !allowRoles.includes(membership.role)
        ) {
            router.replace("/home");
        }
    }, [
        user,
        membership,
        loading,
        membershipLoading,
        allowRoles,
        router,
    ]);

    if (loading || membershipLoading) {
        return <CircularProgress />;
    }

    if (!authorized) {
        return null;
    }

    return <>{children}</>;
}