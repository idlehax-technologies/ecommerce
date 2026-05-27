"use client";

import {
    Paper,
    Stack,
    Typography,
    Divider,
    Button,
} from "@mui/material";

import type { Order } from "@/types/order";

import { getReceiptUrl } from "@/lib/api/orders";

export default function OrderReceipt({
    order,
}: {
    order: Order;
}) {
    return (
        <Paper
            sx={{
                p: 4,
                maxWidth: 700,
                mx: "auto",
            }}
        >

            <Stack spacing={2}>

                <Typography variant="h4">
                    Receipt
                </Typography>

                <Typography color="text.secondary">
                    Order ID: {order.orderId}
                </Typography>

                <Typography color="text.secondary">
                    {new Date(order.createdAt)
                        .toLocaleString()}
                </Typography>

                <Divider />

                {order.items.map((item) => (

                    <Stack
                        key={item.productId}
                        direction="row"
                        justifyContent="space-between"
                    >

                        <Stack>

                            <Typography>
                                {item.name}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                {item.quantity} × ₹ {(item.price / 100).toFixed(2)}
                            </Typography>

                        </Stack>

                        <Typography>
                            ₹ {((item.price * item.quantity) / 100).toFixed(2)}
                        </Typography>

                    </Stack>

                ))}

                <Divider />

                <Stack
                    direction="row"
                    justifyContent="space-between"
                >

                    <Typography fontWeight={600}>
                        Total
                    </Typography>

                    <Typography fontWeight={600}>
                        ₹ {(order.total / 100).toFixed(2)}
                    </Typography>

                </Stack>

                <Stack
                    direction="row"
                    justifyContent="space-between"
                >

                    <Typography>
                        Payment
                    </Typography>

                    <Typography>
                        {order.paymentMethod ?? "Pending Confirmation"}
                    </Typography>

                </Stack>

                <Button
                    variant="outlined"
                    href={getReceiptUrl(order.orderId)}
                    target="_blank"
                >
                    Open Printable Receipt
                </Button>

            </Stack>

        </Paper>
    );
}