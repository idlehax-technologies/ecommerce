import { UserRole } from "./auth";

export type TenantStatus = "created" | "active" | "inactive";

export type Tenant = {
    tenantId: string;
    name: string;
    status: TenantStatus;
    createdAt: string;
    updatedAt: string;
};

export type PublicTenant = {
    tenantId: string;
    name: string;
    status: TenantStatus;
};

export type CreateTenantDTO = {
    name: string;
};

export type UpdateTenantDTO = {
    name: string;
};

/**
 * This is NOT transport data.
 * This is runtime execution identity produced by requireTenant().
 */
export type TenantScopedActor = {
    userId: string;
    role: UserRole;
    tenantId: string;
};
