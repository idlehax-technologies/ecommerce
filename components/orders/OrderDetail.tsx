import { Stack, Typography, Divider, Button } from "@mui/material";

import type { Order } from "@/types/order";

import OrderItemsList from "./OrderItemsList";
import OrderSummary from "./OrderSummary";
import OrderPaymentSection from "./OrderPaymentSection";
import OrderActions from "./OrderActions";
import { MembershipRole } from "@/types/membership";

export default function OrderDetail({
    order,
    reload,
    actorRole,
}: {
    order: Order;
    reload: () => Promise<void>;
    actorRole: MembershipRole;
}) {
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

            {actorRole === "customer" &&
                order.status === "RESERVED" && (
                    <>
                        <Divider />

                        <OrderPaymentSection
                            orderId={order.orderId}
                            reload={reload}
                        />
                    </>
                )}

            {actorRole === "staff" &&
                (order.status === "RESERVED" ||
                    order.status === "PAID") && (
                    <>
                        <Divider />

                        <OrderActions
                            order={order}
                            reload={reload}
                        />
                    </>
                )}

            <Button
                href={`/orders/${order.orderId}/receipt`}
                variant="outlined"
            >
                View Receipt
            </Button>

        </Stack>
    );
}