"use client";

import {
    Box,
    Stack,
    Paper,
    Typography,
    Button,
    Divider,
} from "@mui/material";

import type { Order } from "@/types/order";
import { MembershipRole } from "@/types/membership";

import { getInvoiceUrl } from "@/lib/api/orders";
import { formatDateTime } from "@/lib/format/datetime";

import OrderItemsList from "./OrderItemsList";
import OrderSummary from "./OrderSummary";
import OrderPaymentSection from "./OrderPaymentSection";
import OrderLifecycleActions from "./OrderLifecycleActions";

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
        <Paper elevation={2} sx={{ p: 2 }}>
            <Stack spacing={2}>
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        {order.orderNumber}
                    </Typography>

                    {order.invoiceNumber && (
                        <Typography variant="body2" color="text.secondary">
                            Invoice: {order.invoiceNumber}
                        </Typography>
                    )}

                    {order.invoiceIssuedAt && (
                        <Typography variant="body2" color="text.secondary">
                            Issued: {formatDateTime(order.invoiceIssuedAt)}
                        </Typography>
                    )}
                </Box>

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
                            {/* <Divider />

                            <OrderPaymentSection
                                orderId={order.orderId}
                                reload={reload}
                            /> */}
                        </>
                    )}

                {actorRole === "staff" &&
                    (order.status === "RESERVED" ||
                        order.status === "PAID") && (
                        <>
                            <Divider />

                            <OrderLifecycleActions
                                order={order}
                                reload={reload}
                            />
                        </>
                    )}

                {order.invoiceNumber && (
                    <>
                        <Divider />

                        <Button
                            variant="outlined"
                            href={getInvoiceUrl(order.orderId)}
                            target="_blank"
                        >
                            View Invoice
                        </Button>
                    </>
                )}
            </Stack>
        </Paper>
    );
}