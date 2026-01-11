"use client";

import {
    Box,
    Typography,
    Card,
    CardContent,
    Divider,
    Chip,
} from "@mui/material";
import { orders } from "@/lib/orders";

export default function order() {
    return (
        <Box p={3} maxWidth='800px' mx="auto">
            <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
                My Orders
            </Typography>
            {orders.length == 0 && (
                <Typography color="text.secondary">
                    No Orders Yet.
                </Typography>
            )}
            {orders.map((order) => (
                <Card key={order.orderId} sx={{
                    mb: 2,
                    borderRadius: 3,
                    boxShadow: 3,
                }}>
                    <CardContent>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Typography>
                                Order: {order.orderId}
                            </Typography>
                            <Typography>
                                <Chip
                                    label={order.status}
                                    color={
                                        order.status === "SUCCESS"
                                            ? "success"
                                            : order.status === "FAILED"
                                                ? "error"
                                                : "warning"
                                    }
                                    size="small"
                                    sx={{ minWidth: 90, justifyContent: "center" }}
                                />
                            </Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                            Date: {order.createdAt}
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                            Price: {order.total}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );

}
