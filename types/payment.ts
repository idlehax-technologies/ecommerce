export type PaymentStatus = "PENDING" | "CONFIRMED" | "FAILED";

export type Payment = {
    paymentId: string;

    orderId: string;
    tenantId: string;

    method: "CASH" | "UPI" | "CARD" | "NET_BANKING";

    amount: number;
    currency: "INR";

    status: PaymentStatus;

    createdAt: string;
    updatedAt: string;
};