import AuthGuard from "@/components/guards/AuthGuard";
import Navbar from "@/components/layout/Navbar";

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <Navbar />
            {children}
        </AuthGuard>
    );
}