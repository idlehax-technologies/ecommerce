import { Container, Typography, Box } from "@mui/material";

import { getUserFromRequest } from "@/lib/auth";
import { requireTenant, requireRole } from "@/lib/auth/guards";

import { listTenantOrders } from "@/lib/orders/domain";

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

export default async function FulfillmentPage() {
    const rawUser = await getUserFromRequest();

    requireRole(rawUser, "staff");
    const actor = requireTenant(rawUser);

    const orders = listTenantOrders(actor.tenantId);

    const rows = orders.map(toOrderListItem);

    return (
        <Container sx={{ mt: 6 }}>
            <Typography variant="h4" gutterBottom>
                Fulfillment Dashboard
            </Typography>

            <Box mt={3}>
                <OrdersList orders={rows} />
            </Box>
        </Container>
    );
}