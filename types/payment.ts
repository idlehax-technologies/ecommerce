export type PaymentMethod = "CASH" | "UPI";

export type PaymentStatus = "PENDING" | "CONFIRMED" | "FAILED";

export type Payment = {
    paymentId: string;

    orderId: string;
    tenantId: string;

    amount: number;
    currency: "INR";

    method: PaymentMethod;
    status: PaymentStatus;

    createdAt: string;
    updatedAt: string;
};