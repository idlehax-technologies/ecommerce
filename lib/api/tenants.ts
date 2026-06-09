import type {
    CreateTenantDTO,
    UpdateTenantDTO,
    Tenant,
    PublicTenant,
} from "@/types/tenant";

import { apiFetch } from "./fetch";

export async function createTenant(
    dto: CreateTenantDTO
): Promise<{ tenant: Tenant }> {
    return apiFetch<{ tenant: Tenant }>(
        "/api/admin/tenants",
        {
            method: "POST",
            body: JSON.stringify(dto),
        }
    );
}

export async function updateTenant(
    tenantId: string,
    dto: UpdateTenantDTO
): Promise<{ tenant: Tenant }> {
    return apiFetch<{ tenant: Tenant }>(
        `/api/admin/tenants/${tenantId}`,
        {
            method: "PATCH",
            body: JSON.stringify(dto),
        }
    );
}

/* -------------------------------------------------------------------------- */
/* PUBLIC                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Public tenant discovery.
 *
 * Used by:
 * - membership request flows
 * - public tenant selection UI
 *
 * Returns authoritative tenant data from server state.
 * Client may further filter/group for presentation purposes.
 */
export async function fetchActiveTenants(): Promise<{
    tenants: PublicTenant[];
}> {

    return apiFetch<{
        tenants: PublicTenant[];
    }>(
        "/api/tenants"
    );
}

export async function fetchTenant(
    tenantId: string
): Promise<{
    tenant: Tenant;
}> {
    return apiFetch<{
        tenant: Tenant;
    }>(
        `/api/tenants/${tenantId}`
    );
}