import { runTenantReconciliation } from "./domain";
import type { ReconciliationReport } from "@/types/reconciliation";

export function getReconciliationReport(
    tenantId: string
): ReconciliationReport {

    // idempotent: pure function, no side effects
    return runTenantReconciliation(tenantId);
}