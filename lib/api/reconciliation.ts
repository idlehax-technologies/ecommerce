import { apiFetch } from "./fetch";

import type {
    ReconciliationReport,
} from "@/types/reconciliation";

import type {
    ResolutionRequest,
} from "@/types/reconciliationResolution";

export async function getReconciliation(): Promise<{
    report: ReconciliationReport;
}> {
    return apiFetch<{
        report: ReconciliationReport;
    }>("/api/reconciliation");
}

export async function resolveReconciliation(
    payload: ResolutionRequest
): Promise<{
    success: true;
}> {
    return apiFetch<{ success: true }>(
        "/api/reconciliation/resolve",
        {
            method: "POST",
            body: JSON.stringify(payload),
        }
    );
}