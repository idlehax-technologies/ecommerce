import TenantGuard from "@/components/guards/TenantGuard";

export default function CartLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <TenantGuard allowRoles={["customer"]}>
            {children}
        </TenantGuard>
    );
}