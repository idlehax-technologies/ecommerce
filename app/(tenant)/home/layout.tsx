import TenantGuard from "@/components/guards/TenantGuard";

export default function HomeLayout({
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