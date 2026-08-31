import TenantGuard from "@/components/guards/TenantGuard";

export default function POSLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <TenantGuard allowRoles={["staff"]}>
            {children}
        </TenantGuard>
    );
}