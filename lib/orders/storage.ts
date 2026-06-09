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



// Seeding Orders
export function seedOrders(): void {

    const orders: Order[] = [
        {
            orderId: "order_1",
            orderNumber: "ORD-2026-0001",

            tenantId: "tenant_alpha",
            userId: "u_staff",

            seller: {
                name: "Demo Store",
                address: "123 Park Street, Kolkata",
                state: "West Bengal",
                gstin: "19ABCDE1234F1Z5",
            },

            customer: {
                fullName: "Rahul Sharma",
                phone: "9876543210",
                email: "rahul@example.com",
                addressText: "Salt Lake, Kolkata, West Bengal",
            },

            items: [
                {
                    productId: "product_1",
                    sku: "SKU-001",
                    title: "Wireless Mouse",
                    description: "Wireless Mouse",
                    hsnCode: "8471",
                    gstRate: 18,
                    price: 5900,
                    quantity: 2,
                },
                {
                    productId: "product_2",
                    sku: "SKU-002",
                    title: "Mechanical Keyboard",
                    description: "Mechanical Keyboard",
                    hsnCode: "8471",
                    gstRate: 18,
                    price: 3540,
                    quantity: 1,
                },
            ],

            total: 15340,
            currency: "INR",

            paymentMethod: "UPI",

            invoiceNumber: "INV-2026-0001",
            invoiceIssuedAt: "2026-06-01T10:00:00.000Z",

            status: "PAID",

            createdAt: "2026-06-01T09:55:00.000Z",
            updatedAt: "2026-06-01T10:00:00.000Z",
        },

        {
            orderId: "order_2",
            orderNumber: "ORD-2026-0002",

            tenantId: "tenant_1",
            userId: "user_2",

            seller: {
                name: "Demo Store",
                address: "123 Park Street, Kolkata",
                state: "West Bengal",
                gstin: "19ABCDE1234F1Z5",
            },

            customer: {
                fullName: "Priya Das",
                phone: "9123456780",
                email: "priya@example.com",
                addressText: "New Town, Kolkata, West Bengal",
            },

            items: [
                {
                    productId: "product_3",
                    sku: "SKU-003",
                    title: "USB-C Charger",
                    description: "65W Fast USB-C Charger",
                    hsnCode: "8504",
                    gstRate: 18,
                    price: 2360,
                    quantity: 2,
                },
            ],

            total: 4720,
            currency: "INR",

            paymentMethod: "CARD",

            invoiceNumber: "INV-2026-0002",
            invoiceIssuedAt: "2026-06-02T14:30:00.000Z",

            status: "REFUNDED",

            createdAt: "2026-06-02T14:20:00.000Z",
            updatedAt: "2026-06-03T08:00:00.000Z",
        },

        {
            orderId: "order_3",
            orderNumber: "ORD-2026-0003",

            tenantId: "tenant_1",
            userId: "user_3",

            seller: {
                name: "Small Local Shop",
                address: "45 Market Road, Kolkata",
                state: "West Bengal",
            },

            customer: {
                fullName: "Amit Roy",
                phone: "9000000000",
                email: "amit@example.com",
                addressText: "Barrackpore, West Bengal",
            },

            items: [
                {
                    productId: "product_4",
                    sku: "SKU-004",
                    title: "Notebook",
                    description: "A4 Ruled Notebook",
                    hsnCode: "4820",
                    gstRate: 12,
                    price: 4500,
                    quantity: 3,
                },
            ],

            total: 13500,
            currency: "INR",

            paymentMethod: "CASH",

            invoiceNumber: "INV-2026-0003",
            invoiceIssuedAt: "2026-06-03T11:00:00.000Z",

            status: "PICKED_UP",

            createdAt: "2026-06-03T10:45:00.000Z",
            updatedAt: "2026-06-03T11:05:00.000Z",
        },
    ];

    for (const order of orders) {
        saveOrder(order);
    }
}

if (ordersById.size === 0) {
    seedOrders();
}



/**
 * Save order
 */
export function saveOrder(order: Order): void {

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

    if (!tenantBucket) return [];

    return Array.from(tenantBucket.values()).map(o => ({ ...o }))
}