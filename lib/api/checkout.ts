import { apiFetch } from "./fetch";

import type { CheckoutResponse } from "@/types/checkout";

export async function checkout(): Promise<CheckoutResponse> {

    return apiFetch<CheckoutResponse>(
        "/api/checkout",
        {
            method: "POST",
        }
    );
}