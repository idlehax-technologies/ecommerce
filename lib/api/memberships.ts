async function handle(res: Response) {
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Request failed");
    return data;
}

export const requestMembership = (tenantId: string) =>
    fetch("/api/memberships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId }),
    }).then(handle);

export const myMemberships = () =>
    fetch("/api/memberships").then(handle);

export const pendingMemberships = () =>
    fetch("/api/admin/memberships").then(handle);

export const getMembership = (membershipId: string) =>
    fetch(`/api/admin/memberships/${membershipId}`).then(handle);

export const approveMembership = (membershipId: string) =>
    fetch(`/api/admin/memberships/${membershipId}/approve`, {
        method: "POST",
    }).then(handle);

export const rejectMembership = (membershipId: string) =>
    fetch(`/api/admin/memberships/${membershipId}/reject`, {
        method: "POST",
    }).then(handle);
