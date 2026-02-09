"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function RoleGuard({
    allow,
    children,
}: {
    allow: string[];
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || !allow.includes(user.role))) {
            router.replace("/");
        }
    }, [user, loading]);

    if (loading || !user || !allow.includes(user.role)) return null;

    return <>{children}</>;
}
