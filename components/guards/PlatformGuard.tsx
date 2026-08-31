"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";

import { useAuth } from "@/contexts/AuthContext";
import { useActiveMembership } from "@/hooks/useActiveMembership";

import {
    getMembershipLandingPage,
    getNoMembershipLandingPage,
    getUnauthenticatedLandingPage,
} from "@/lib/navigation/defaultLandingPage";

type Props = {
    children: React.ReactNode;
};

export default function PlatformGuard({
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
        user.isSuperadmin;

    useEffect(() => {
        if (loading || membershipLoading) {
            return;
        }

        // not logged in
        if (!user) {
            router.replace(getUnauthenticatedLandingPage());
            return;
        }

        // tenant actor
        if (!user.isSuperadmin) {

            if (!membership) {
                router.replace(getNoMembershipLandingPage());
                return;
            }

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