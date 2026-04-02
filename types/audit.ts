export type AuditLog = {
    auditId: string;

    tenantId: string;
    actorId: string;

    action: string;
    entityType: string;
    entityId: string;

    metadata: Record<string, unknown>;

    createdAt: string;
};