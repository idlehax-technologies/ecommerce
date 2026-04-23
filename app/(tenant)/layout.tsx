import Navbar from "@/components/Navbar";
import CartWidget from "@/components/tenant/CartWidget";
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