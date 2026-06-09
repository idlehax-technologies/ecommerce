import { Box, Typography } from "@mui/material";
import type { CartItem } from "@/types/cart";

export default function CartSummary({
    items,
    hasGst,
}: {
    items: CartItem[];
    hasGst: boolean;
}) {
    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

    return (
        <Box display="flex" justifyContent="flex-end">
            <Typography variant="h6" fontWeight={600}>
                Total: ₹{(total / 100).toFixed(2)}
                {hasGst && " (incl. GST)"}
            </Typography>
        </Box>
    );
}
