import { apiFetch } from "./fetch";

export async function assumeTenant(
    tenantId: string
): Promise<{ success: true }> {

    return apiFetch<{ success: true }>(
        `/api/admin/tenants/${tenantId}/assume`,
        {
            method: "POST",
        }
    );
}