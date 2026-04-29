import type { AuditLog } from "@/types/audit";

export async function getAuditLogs(): Promise<AuditLog[]> {
    const res = await fetch("/api/audit", { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch audit logs");
    return res.json();
}