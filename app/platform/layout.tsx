import Navbar from "@/components/Navbar";
import { CartProvider } from "@/contexts/CartContext";

export default function TenantLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            {children}
        </>
    );
}