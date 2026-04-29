import { apiFetch } from "./fetch";
import type { ReconciliationReport } from "@/types/reconciliation";
import { ResolutionRequest } from "@/types/reconciliationResolution";

export async function getReconciliation(): Promise<ReconciliationReport> {
    return apiFetch("/api/reconciliation");
}

export async function resolveReconciliation(
    payload: ResolutionRequest
) {
    return apiFetch("/api/reconciliation/resolve", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}