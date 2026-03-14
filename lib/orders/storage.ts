import type { Order } from "@/types/order";

type GlobalOrders = typeof globalThis & {
    __ordersById?: Map<string, Order>;
    __ordersByTenant?: Map<string, Map<string, Order>>;
};

const globalForOrders = globalThis as GlobalOrders;

const ordersById =
    globalForOrders.__ordersById ?? new Map<string, Order>();

const ordersByTenant =
    globalForOrders.__ordersByTenant ??
    new Map<string, Map<string, Order>>();

globalForOrders.__ordersById = ordersById;
globalForOrders.__ordersByTenant = ordersByTenant;


/**
 * Save order
 */
export function saveOrder(order: Order) {

    const snapshot = { ...order };

    ordersById.set(snapshot.orderId, snapshot);

    let tenantBucket = ordersByTenant.get(snapshot.tenantId);

    if (!tenantBucket) {
        tenantBucket = new Map<string, Order>();
        ordersByTenant.set(snapshot.tenantId, tenantBucket);
    }

    tenantBucket.set(snapshot.orderId, snapshot);
}


/**
 * Retrieve order by ID
 */
export function getOrder(orderId: string): Order | undefined {

    const order = ordersById.get(orderId);

    if (!order) return undefined;

    return { ...order };
}


/**
 * List orders belonging to a tenant
 */
export function listOrdersByTenant(tenantId: string): Order[] {

    const tenantBucket = ordersByTenant.get(tenantId)

    if (!tenantBucket) return []

    return Array.from(tenantBucket.values()).map(o => ({ ...o }))
}