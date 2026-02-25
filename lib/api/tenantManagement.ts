// lib/api/tenantManagement.ts

async function handle(res: Response) {
    if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Request failed");
    }
    return res.json();
}

export const tenantAdminApi = {
    create: (body: { name: string }) =>
        fetch("/api/admin/tenants", {
            method: "POST",
            body: JSON.stringify(body),
        }).then(handle),

    list: () =>
        fetch("/api/admin/tenants").then(handle),

    get: (tenantId: string) =>
        fetch(`/api/admin/tenants/${tenantId}`).then(handle),

    activate: (tenantId: string) =>
        fetch(`/api/admin/tenants/${tenantId}/activate`, { method: "POST" }).then(handle),

    deactivate: (tenantId: string) =>
        fetch(`/api/admin/tenants/${tenantId}/deactivate`, { method: "POST" }).then(handle),
};
