import { runTenantReconciliation } from "./domain";
import type { ReconciliationReport } from "@/types/reconciliation";

export async function getReconciliationReport(
    tenantId: string
): Promise<ReconciliationReport> {

    // idempotent: pure function, no side effects
    return runTenantReconciliation(tenantId);
}