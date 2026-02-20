import { Box, Typography } from "@mui/material";
import type { CartItem } from "@/types/cart";

export default function CartSummary({ items }: { items: CartItem[] }) {
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

    return (
        <Box display="flex" justifyContent="flex-end">
            <Typography variant="h6" fontWeight={600}>
                Subtotal: ₹ {(subtotal / 100).toFixed(2)}
            </Typography>
        </Box>
    );
}
