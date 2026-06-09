import { IndianState } from "@/lib/tenants/states";

export type TenantStatus =
    | "PENDING"
    | "ACTIVE"
    | "SUSPENDED"
    | "ARCHIVED";

export type Tenant = {
    tenantId: string;

    name: string;

    address: string;
    state: IndianState;

    gstin?: string;

    status: TenantStatus;

    createdAt: string;
    updatedAt: string;
};

export type PublicTenant = {
    tenantId: string;

    name: string;

    address: string;
    state: IndianState;

    gstin?: string;

    status: TenantStatus;
};

export type CreateTenantDTO = {
    name: string;

    address: string;
    state: IndianState;

    gstin?: string;
};

export type UpdateTenantDTO = Partial<CreateTenantDTO>;