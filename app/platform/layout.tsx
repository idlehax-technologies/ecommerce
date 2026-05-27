"use client";

import PlatformGuard from "@/components/guards/PlatformGuard";
import Navbar from "@/components/layout/Navbar";

export default function PlatformLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <PlatformGuard>
            <Navbar />
            {children}
        </PlatformGuard>
    );
}