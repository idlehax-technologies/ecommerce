import { apiFetch } from "./fetch";

import type {
    CreatePOSOrderDTO,
    POSResponse,
} from "@/types/pos";

export async function createPOSOrder(
    payload: CreatePOSOrderDTO
): Promise<POSResponse> {
    return apiFetch<POSResponse>(
        "/api/pos",
        {
            method: "POST",
            body: JSON.stringify(payload),
        }
    );
}