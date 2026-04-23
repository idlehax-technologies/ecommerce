"use client";

import AccessGuard from "@/components/guards/AccessGuard";

export default function MembershipsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AccessGuard
            allowRoles={["staff"]}
            allowSuperadmin
        >
            {children}
        </AccessGuard>
    );
}