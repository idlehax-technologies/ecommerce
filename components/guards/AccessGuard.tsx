"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useActiveMembership } from "@/hooks/useActiveMembership";
import { useAuth } from "@/contexts/AuthContext";
import { MembershipRole } from "@/types/membership";
import { CircularProgress } from "@mui/material";

type Props = {
    allowRoles?: MembershipRole[];
    allowSuperadmin?: boolean;
    children: React.ReactNode;
};

export default function AccessGuard({
    allowRoles,
    allowSuperadmin,
    children,
}: Props) {
    const { user, loading } = useAuth();
    const { membership, loading: mLoading } = useActiveMembership();
    const router = useRouter();

    useEffect(() => {
        if (loading || mLoading) return;

        // ❌ not logged in
        if (!user) {
            router.replace("/login");
            return;
        }

        // ✅ superadmin override
        if (allowSuperadmin && user.isSuperadmin) {
            return;
        }

        // ❌ no membership
        if (!membership) {
            router.replace("/profile");
            return;
        }

        // ❌ role mismatch
        if (allowRoles && !allowRoles.includes(membership.role)) {
            router.replace("/");
            return;
        }
    }, [user, membership, loading, mLoading, allowSuperadmin, allowRoles, router]);

    // UI only handles loading
    if (loading || mLoading) return <CircularProgress />;

    return <>{children}</>;
}