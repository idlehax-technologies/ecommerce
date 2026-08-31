import TenantGuard from "@/components/guards/TenantGuard";

export default function ReconciliationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <TenantGuard allowRoles={["admin"]}>
            {children}
        </TenantGuard>
    );
}