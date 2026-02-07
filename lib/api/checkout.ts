import type {
    CheckoutRequest,
    CheckoutResponse,
} from "@/types/checkout";

export async function checkout(
    payload: CheckoutRequest
): Promise<CheckoutResponse> {
    const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.message ?? "Checkout failed");
    }

    return data;
}
