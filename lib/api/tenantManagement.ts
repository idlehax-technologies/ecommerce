import { apiFetch } from "./fetch";

export const tenantAdminApi = {
    create: (body: { name: string }) =>
        apiFetch("/api/admin/tenants", {
            method: "POST",
            body: JSON.stringify(body),
        }),

    list: () =>
        apiFetch("/api/admin/tenants"),

    get: (tenantId: string) =>
        apiFetch(`/api/admin/tenants/${tenantId}`),

    activate: (tenantId: string) =>
        apiFetch(`/api/admin/tenants/${tenantId}/activate`, { method: "POST" }),

    suspend: (tenantId: string) =>
        apiFetch(`/api/admin/tenants/${tenantId}/suspend`, { method: "POST" }),

    archive: (tenantId: string) =>
        apiFetch(`/api/admin/tenants/${tenantId}/archive`, { method: "POST" }),
};