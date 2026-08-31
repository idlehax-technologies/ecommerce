import TenantGuard from "@/components/guards/TenantGuard";

export default function OrdersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <TenantGuard allowRoles={["customer", "staff"]}>
            {children}
        </TenantGuard>
    );
}