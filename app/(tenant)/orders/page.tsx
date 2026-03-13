// app/(tenant)/orders/page.tsx

import { Container, Typography, Box } from "@mui/material";
import { requireTenant } from "@/lib/auth/guards";
import { getUserFromRequest } from "@/lib/auth";
import { listTenantOrders } from "@/lib/orders/domain";

import OrdersList from "@/components/orders/OrdersList";
import type { Order, OrderListItem } from "@/types/order";

/**
 * Projection from domain aggregate → list view model
 */
function toOrderListItem(order: Order): OrderListItem {
    return {
        orderId: order.orderId,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
    };
}

export default async function OrdersPage() {
    const actor = requireTenant(await getUserFromRequest());

    const orders = listTenantOrders(actor.tenantId);

    const rows = orders.map(toOrderListItem);

    return (
        <Container sx={{ mt: 6 }}>
            <Typography variant="h4" gutterBottom>
                My Orders
            </Typography>

            <Box mt={3}>
                <OrdersList orders={rows} />
            </Box>
        </Container>
    );
}