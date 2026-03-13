import { Stack, Typography, Divider } from "@mui/material";
import type { Order } from "@/types/order";
import OrderItemsList from "./OrderItemsList";
import OrderSummary from "./OrderSummary";

export default function OrderDetail({ order }: { order: Order }) {
    return (
        <Stack spacing={3}>
            <Typography variant="h5" fontWeight={600}>
                Order {order.orderId}
            </Typography>

            <Typography variant="body2" color="text.secondary">
                {new Date(order.createdAt).toLocaleString()}
            </Typography>

            <Divider />

            <OrderItemsList items={order.items} />

            <Divider />

            <OrderSummary order={order} />
        </Stack>
    );
}