import { apiFetch } from "./fetch";
import type {
    CheckoutRequest,
    CheckoutResponse,
} from "@/types/checkout";

export function checkout(
    payload: CheckoutRequest
): Promise<CheckoutResponse> {
    return apiFetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}