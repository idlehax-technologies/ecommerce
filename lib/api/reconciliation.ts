import type { ReconciliationReport } from "@/types/reconciliation";
import { ResolutionRequest } from "@/types/reconciliationResolution";

export async function getReconciliation(): Promise<ReconciliationReport> {
    const res = await fetch("/api/reconciliation");

    if (!res.ok) {
        throw new Error("Failed to fetch reconciliation");
    }

    return res.json();
}

export async function resolveReconciliation(
    payload: ResolutionRequest
) {
    const res = await fetch("/api/reconciliation/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        throw new Error("Resolution failed");
    }

    return res.json();
}