import RoleGuard from "@/components/guards/RoleGuard";

export default function SuperadminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <RoleGuard allow={["staff"]}>{children}</RoleGuard>;
}
