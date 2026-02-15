"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { UserRole } from "@/types/auth";

type Props = {
    allow: UserRole[];
    children: React.ReactNode;
};

export default function RoleGuard({ allow, children }: Props) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || !allow.includes(user.role))) {
            router.replace("/");
        }
    }, [user, loading, allow, router]);

    if (loading || !user || !allow.includes(user.role)) return null;

    return <>{children}</>;
}
