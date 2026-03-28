"use client";

import {
    Box,
    Stack,
    Typography,
    Divider,
    Button,
} from "@mui/material";

import type { Order } from "@/types/order";

export default function OrderReceipt({ order }: { order: Order }) {
    function handlePrint() {
        window.print();
    }

    function handleDownload() {
        window.open(`/api/orders/${order.orderId}/receipt`, "_blank");
    }

    return (
        <Box
            sx={{
                maxWidth: 600,
                margin: "0 auto",
                p: 4,
                background: "#fff",
                color: "#000",
            }}
        >
            {/* 🔥 Actions */}
            <Stack
                direction="row"
                spacing={2}
                sx={{ mb: 3 }}
                className="no-print"
            >
                <Button variant="contained" onClick={handlePrint}>
                    Print
                </Button>

                <Button variant="outlined" onClick={handleDownload}>
                    Open Printable Version
                </Button>
            </Stack>

            <Stack spacing={2}>
                <Typography variant="h5" fontWeight={700}>
                    Receipt
                </Typography>

                <Typography variant="body2">
                    Order ID: {order.orderId}
                </Typography>

                <Typography variant="body2">
                    Date: {new Date(order.createdAt).toLocaleString()}
                </Typography>

                <Divider />

                {order.items.map((item) => {
                    const total = item.price * item.quantity;

                    return (
                        <Box
                            key={item.productId}
                            display="flex"
                            justifyContent="space-between"
                        >
                            <Box>
                                <Typography fontWeight={500}>
                                    {item.name}
                                </Typography>

                                <Typography variant="body2">
                                    {item.quantity} × ₹ {(item.price / 100).toFixed(2)}
                                </Typography>
                            </Box>

                            <Typography>
                                ₹ {(total / 100).toFixed(2)}
                            </Typography>
                        </Box>
                    );
                })}

                <Divider />

                <Box display="flex" justifyContent="space-between">
                    <Typography fontWeight={600}>
                        Total
                    </Typography>

                    <Typography fontWeight={600}>
                        ₹ {(order.total / 100).toFixed(2)}
                    </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">
                        Payment Method
                    </Typography>

                    <Typography variant="body2">
                        {order.status === "RESERVED"
                            ? "Pending Confirmation"
                            : order.paymentMethod}
                    </Typography>
                </Box>

                <Divider />

                <Typography align="center" variant="body2">
                    Thank you for your purchase
                </Typography>
            </Stack>
        </Box>
    );
}