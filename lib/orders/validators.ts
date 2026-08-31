import { PaymentMethod } from "@/types/payment";

const PAYMENT_METHODS: PaymentMethod[] = [
    "CASH",
    "UPI",
];

function isPaymentMethod(
    value: unknown
): value is PaymentMethod {
    return (
        typeof value === "string" &&
        PAYMENT_METHODS.includes(value as PaymentMethod)
    );
}

export function assertPayOrderDTO(
    body: unknown
): asserts body is { method: PaymentMethod } {
    if (
        typeof body !== "object" ||
        body === null
    ) {
        throw new Error("Invalid payment payload");
    }

    const obj = body as Record<string, unknown>;

    if (!isPaymentMethod(obj.method)) {
        throw new Error("Invalid payment method");
    }
}