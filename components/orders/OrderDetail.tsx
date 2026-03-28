import { Stack, Typography, Divider, Button } from "@mui/material";
import type { Order } from "@/types/order";
import OrderItemsList from "./OrderItemsList";
import OrderSummary from "./OrderSummary";
import OrderPaymentSection from "./OrderPaymentSection";
import OrderActions from "./OrderActions";

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

            {/* 🔥 Step 5 addition */}
            {order.status === "RESERVED" && (
                <>
                    <Divider />
                    <OrderPaymentSection orderId={order.orderId} />
                </>
            )}

            {/* 🔥 Step 7: Staff-only actions */}
            {order.placedByStaffId && (order.status === "RESERVED" || order.status === "PAID") && (
                <>
                    <Divider />
                    <OrderActions order={order} />
                </>
            )}

            {/* 🔥 Step 9: Receipt access */}
            <Button
                href={`/orders/${order.orderId}/receipt`}
                variant="outlined"
            >
                View Receipt
            </Button>
        </Stack>
    );
}