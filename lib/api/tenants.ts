import { apiFetch } from "./fetch";

import type {
    CreateTenantDTO,
    PublicTenant,
} from "@/types/tenant";

export const tenantAdminApi = {

    create: (
        body: CreateTenantDTO
    ): Promise<{
        tenant: PublicTenant;
    }> =>
        apiFetch<{
            tenant: PublicTenant;
        }>(
            "/api/admin/tenants",
            {
                method: "POST",
                body: JSON.stringify(body),
            }
        ),

    list: (): Promise<{
        tenants: PublicTenant[];
    }> =>
        apiFetch<{
            tenants: PublicTenant[];
        }>(
            "/api/admin/tenants"
        ),

    get: (
        tenantId: string
    ): Promise<{
        tenant: PublicTenant;
    }> =>
        apiFetch<{
            tenant: PublicTenant;
        }>(
            `/api/admin/tenants/${tenantId}`
        ),

    activate: (
        tenantId: string
    ): Promise<{
        tenant: PublicTenant;
    }> =>
        apiFetch<{
            tenant: PublicTenant;
        }>(
            `/api/admin/tenants/${tenantId}/activate`,
            {
                method: "POST",
            }
        ),

    suspend: (
        tenantId: string
    ): Promise<{
        tenant: PublicTenant;
    }> =>
        apiFetch<{
            tenant: PublicTenant;
        }>(
            `/api/admin/tenants/${tenantId}/suspend`,
            {
                method: "POST",
            }
        ),

    archive: (
        tenantId: string
    ): Promise<{
        tenant: PublicTenant;
    }> =>
        apiFetch<{
            tenant: PublicTenant;
        }>(
            `/api/admin/tenants/${tenantId}/archive`,
            {
                method: "POST",
            }
        ),
};

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
export async function fetchTenants(): Promise<{
    tenants: PublicTenant[];
}> {

    return apiFetch<{
        tenants: PublicTenant[];
    }>(
        "/api/tenants"
    );
}