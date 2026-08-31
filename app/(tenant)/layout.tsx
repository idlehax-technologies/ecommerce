import { Box } from "@mui/material";
import Navbar from "@/components/layout/Navbar";
import CartWidget from "@/components/layout/CartWidget";
import Sidebar from "@/components/layout/Sidebar";
import { CartProvider } from "@/contexts/CartContext";

export default function TenantLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <CartProvider>
            <Navbar rightSlot={<CartWidget />} />

            <Box sx={{ display: "flex", flex: 1 }}>
                <Sidebar />

                <Box sx={{ flex: 1 }}>
                    {children}
                </Box>
            </Box>
        </CartProvider>
    );
}