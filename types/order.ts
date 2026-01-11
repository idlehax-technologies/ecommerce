export type OrderStatus = "PENDING" | "SUCCESS" | "FAILED";

export type OrderItem = {
    productId: number;
    vendorId: string;
    name: string;
    price: number;
    quantity: number;
};

export type Order = {
    orderId: string;
    items: OrderItem[];
    total: number;
    currency: "INR";
    status: OrderStatus;
    createdAt: string; // ISO date string
};
