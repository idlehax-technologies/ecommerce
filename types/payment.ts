export type PaymentMethod = "CASH" | "UPI" | "CARD" | "NET_BANKING";

export type PaymentStatus = "PENDING" | "CONFIRMED" | "FAILED";

export type Payment = {
    paymentId: string;

    orderId: string;
    tenantId: string;

    method: PaymentMethod;

    amount: number;
    currency: "INR";

    status: PaymentStatus;

    createdAt: string;
    updatedAt: string;
};