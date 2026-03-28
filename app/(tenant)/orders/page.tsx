import { Container, Typography, Box } from "@mui/material";

import { getUserFromRequest } from "@/lib/auth";
import { requireTenant, requireAuth } from "@/lib/auth/guards";

import { listTenantOrdersForUser } from "@/lib/orders/domain";

import OrdersList from "@/components/orders/OrdersList";
import type { Order, OrderListItem } from "@/types/order";

function toOrderListItem(order: Order): OrderListItem {
    return {
        orderId: order.orderId,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
    };
}

export default async function OrdersPage() {
    const rawUser = await getUserFromRequest();

    const user = requireAuth(rawUser);
    const actor = requireTenant(user);

    const orders = listTenantOrdersForUser(
        actor.tenantId,
        user.userId
    );

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