import TenantGuard from "@/components/guards/TenantGuard";

export default function InventoryLayout({
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