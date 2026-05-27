"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";

import { useAuth } from "@/contexts/AuthContext";

type Props = {
    children: React.ReactNode;
};

export default function AuthGuard({
    children,
}: Props) {
    const router = useRouter();

    const { user, loading } = useAuth();

    const authorized =
        !!user &&
        !user.isSuperadmin;

    useEffect(() => {
        if (loading) {
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
        }
    }, [user, loading, router]);

    if (loading) {
        return <CircularProgress />;
    }

    if (!authorized) {
        return null;
    }

    return <>{children}</>;
}