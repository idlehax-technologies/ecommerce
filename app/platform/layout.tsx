import AccessGuard from "@/components/guards/AccessGuard";
import Navbar from "@/components/Navbar";

export default function TenantLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AccessGuard
            allowSuperadmin
        >
            <Navbar />
            {children}
        </AccessGuard>
    );
}