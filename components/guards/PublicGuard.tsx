"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";

import { useAuth } from "@/contexts/AuthContext";
import { useActiveMembership } from "@/hooks/useActiveMembership";

import {
    getMembershipLandingPage,
    getNoMembershipLandingPage,
    getSuperadminLandingPage,
} from "@/lib/navigation/defaultLandingPage";

type Props = {
    children: React.ReactNode;
};

export default function PublicGuard({
    children,
}: Props) {
    const router = useRouter();

    const { user, loading } = useAuth();
    const {
        membership,
        loading: membershipLoading,
    } = useActiveMembership();

    const authorized = !user;

    useEffect(() => {
        if (loading || membershipLoading) {
            return;
        }

        // authenticated actor
        if (user) {

            // platform actor
            if (user.isSuperadmin) {
                router.replace(getSuperadminLandingPage());
                return;
            }

            // authenticated but no approved membership
            if (!membership) {
                router.replace(getNoMembershipLandingPage());
                return;
            }

            // tenant actor
            router.replace(getMembershipLandingPage(membership.role));
            return;
        }

    }, [
        user,
        membership,
        loading,
        membershipLoading,
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