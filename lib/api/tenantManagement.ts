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

    get: (id: string) =>
        fetch(`/api/admin/tenants/${id}`).then(handle),

    activate: (id: string) =>
        fetch(`/api/admin/tenants/${id}/activate`, { method: "POST" }).then(handle),

    deactivate: (id: string) =>
        fetch(`/api/admin/tenants/${id}/deactivate`, { method: "POST" }).then(handle),
};
