export type OrderStatus =
    | "RESERVED"
    | "PAID"
    | "PICKED_UP"
    | "CANCELLED"
    | "EXPIRED"
    | "REFUNDED"; // ✅ NEW

export type PaymentMethod = "CASH" | "UPI" | "CARD" | "NET_BANKING";

export type OrderItem = {
    productId: string;

    name: string;     // snapshot
    price: number;    // snapshot
    quantity: number;
};

export type Order = {
    orderId: string;

    tenantId: string;     // belongs to one tenant
    userId: string;       // who placed it
    placedByStaffId?: string; // POS mode

    items: OrderItem[];

    total: number;
    currency: "INR";

    paymentMethod: PaymentMethod;
    status: OrderStatus;

    createdAt: string;
    updatedAt: string;
};

export type OrderListItem = Pick<
    Order,
    "orderId" | "total" | "status" | "createdAt"
>;