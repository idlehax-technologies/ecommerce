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
