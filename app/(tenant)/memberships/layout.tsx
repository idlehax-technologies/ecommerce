import TenantGuard from "@/components/guards/TenantGuard";

export default function MembershipsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <TenantGuard allowRoles={["staff", "admin"]}>
            {children}
        </TenantGuard>
    );
}