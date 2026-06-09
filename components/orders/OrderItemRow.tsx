import { Paper, Box, Typography } from "@mui/material";
import type { ItemSnapshot } from "@/types/order";

export default function OrderItemRow({ item }: { item: ItemSnapshot }) {
    return (
        <Paper sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
            <Box>
                <Typography fontWeight={500}>
                    {item.title}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    Qty: {item.quantity} × ₹{(item.price / 100).toFixed(2)}
                </Typography>
            </Box>

            <Typography>
                ₹{((item.quantity * item.price) / 100).toFixed(2)}
            </Typography>
        </Paper>
    );
}