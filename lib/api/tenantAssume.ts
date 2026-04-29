import { apiFetch } from "./fetch";

export async function assumeTenant(tenantId: string) {
    return apiFetch(`/api/admin/tenants/${tenantId}/assume`, {
        method: "POST",
    });
}