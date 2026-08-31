export type AuditEventType =
    | "ORDER_CREATED"
    | "ORDER_PAID"
    | "ORDER_CANCELLED"
    | "ORDER_EXPIRED"
    | "ORDER_PICKED_UP"
    | "ORDER_REFUNDED"
    | "MEMBERSHIP_REQUESTED"
    | "MEMBERSHIP_APPROVED"
    | "MEMBERSHIP_REJECTED"
    | "MEMBERSHIP_REVOKED"
    | "MEMBERSHIP_EXPIRED"
    | "MEMBERSHIP_ROLE_UPDATED"
    | "INVENTORY_ADJUSTED"
    | "INVENTORY_RECONCILED"
    | "PAYMENT_CONFIRMED";

// INVENTORY uses productId as entityId; tenantId + entityId identify the TenantInventory
export type AuditEntityType =
    | "ORDER"
    | "MEMBERSHIP"
    | "INVENTORY"
    | "PAYMENT";

export type AuditLog = {
    auditId: string;

    tenantId: string;
    actorId: string;

    eventType: AuditEventType;

    entityType: AuditEntityType;
    entityId: string;

    from?: Record<string, unknown>;
    to: Record<string, unknown>;

    metadata: Record<string, unknown>;

    createdAt: string;
};