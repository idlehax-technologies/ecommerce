import PublicGuard from "@/components/guards/PublicGuard";

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <PublicGuard>
            {children}
        </PublicGuard>
    );
}