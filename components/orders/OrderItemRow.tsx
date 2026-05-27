import { Paper, Box, Typography } from "@mui/material";
import type { OrderItem } from "@/types/order";

export default function OrderItemRow({ item }: { item: OrderItem }) {
    return (
        <Paper sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
            <Box>
                <Typography fontWeight={500}>
                    {item.name}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    Qty: {item.quantity}
                </Typography>
            </Box>

            <Typography>
                ₹ {((item.price * item.quantity) / 100).toFixed(2)}
            </Typography>
        </Paper>
    );
}