import { PaymentMethod } from "./payment";

export type OrderStatus =
    | "RESERVED"
    | "PAID"
    | "PICKED_UP"
    | "CANCELLED"
    | "EXPIRED"
    | "REFUNDED";

export type OrderItem = {
    productId: string;

    name: string;     // snapshot
    price: number;    // snapshot
    quantity: number;
};

export type Order = {
    orderId: string;

    tenantId: string;
    userId: string;

    placedByStaffId?: string;

    items: OrderItem[];

    total: number;
    currency: "INR";

    paymentMethod?: PaymentMethod;

    status: OrderStatus;

    createdAt: string;
    updatedAt: string;
};

export type CreatePOSOrderDTO = {
    items: {
        productId: string;
        quantity: number;
    }[];
    paymentMethod?: PaymentMethod;
};

export type OrderListItem = Pick<
    Order,
    "orderId" | "total" | "status" | "createdAt"
>;