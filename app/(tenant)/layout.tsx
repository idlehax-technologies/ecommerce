import Navbar from "@/components/layout/Navbar";
import CartWidget from "@/components/layout/CartWidget";
import { CartProvider } from "@/contexts/CartContext";

export default function TenantLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <CartProvider>
            <Navbar rightSlot={<CartWidget />} />
            {children}
        </CartProvider>
    );
}