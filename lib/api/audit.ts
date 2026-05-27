import { apiFetch } from "./fetch";

import type { AuditLog } from "@/types/audit";

export async function getAuditLogs(): Promise<{
    logs: AuditLog[];
}> {
    return apiFetch<{ logs: AuditLog[] }>("/api/audit");
}