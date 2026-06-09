import {
    Stack,
    Typography,
    Divider,
    Button,
} from "@mui/material";

import type { Order } from "@/types/order";
import { MembershipRole } from "@/types/membership";

import { getInvoiceUrl } from "@/lib/api/orders";

import OrderItemsList from "./OrderItemsList";
import OrderSummary from "./OrderSummary";
import OrderPaymentSection from "./OrderPaymentSection";
import OrderActions from "./OrderActions";

export default function OrderDetail({
    order,
    reload,
    actorRole,
    hasGst,
}: {
    order: Order;
    reload: () => Promise<void>;
    actorRole: MembershipRole;
    hasGst: boolean;
}) {
    return (
        <Stack spacing={3}>

            <Stack spacing={1}>

                <Typography
                    variant="h5"
                    fontWeight={600}
                >
                    Order: {order.orderNumber}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Placed: {new Date(order.createdAt)
                        .toLocaleString()}
                </Typography>

                {order.invoiceNumber && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Invoice: {order.invoiceNumber}
                    </Typography>
                )}

                {order.invoiceIssuedAt && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Issued: {new Date(order.invoiceIssuedAt)
                            .toLocaleString()}
                    </Typography>
                )}

            </Stack>

            <Divider />

            <OrderItemsList items={order.items} />

            <Divider />

            <OrderSummary
                order={order}
                hasGst={hasGst}
            />

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

            {order.invoiceNumber && (
                <Button
                    variant="outlined"
                    href={getInvoiceUrl(order.orderId)}
                    target="_blank"
                >
                    View Invoice
                </Button>
            )}

        </Stack>
    );
}