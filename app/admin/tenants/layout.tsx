import RoleGuard from "@/components/guards/RoleGuard";

export default function SuperadminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <RoleGuard allow={["superadmin"]}>{children}</RoleGuard>;
}
