import { Box, Typography, Chip, Stack } from "@mui/material";
import type { Order } from "@/types/order";

export default function OrderSummary({ order }: { order: Order }) {
    return (
        <Stack spacing={1}>
            <Box display="flex" justifyContent="space-between">
                <Typography fontWeight={600}>
                    Total
                </Typography>

                <Typography fontWeight={600}>
                    ₹ {(order.total / 100).toFixed(2)}
                </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                    Payment
                </Typography>

                <Typography variant="body2">
                    {order.paymentMethod ?? "Pending Confirmation"}
                </Typography>
            </Box>

            <Chip
                label={order.status}
                size="small"
                sx={{ width: "fit-content", mt: 1 }}
            />
        </Stack>
    );
}