import { Membership, MembershipView } from "@/types/membership";

type Json = Record<string, unknown>;

async function handle<T>(res: Response): Promise<T> {
    const data: unknown = await res.json();

    if (!res.ok) {
        const err = data as { error?: string };
        throw new Error(err?.error || "Request failed");
    }

    return data as T;
}

async function get<T>(url: string): Promise<T> {
    const res = await fetch(url);
    return handle<T>(res);
}

async function post<T>(url: string, body?: Json): Promise<T> {
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
    });

    return handle<T>(res);
}

async function patch<T>(url: string, body?: Json): Promise<T> {
    const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
    });

    return handle<T>(res);
}

// export const fetchMemberships = () =>
//     get<Membership[]>("/api/memberships");

// export const getMembership = (id: string) =>
//     get<Membership>(`/api/memberships/${id}`);

export const fetchActiveMembership = () =>
    get<{ membership: Membership | null }>("/api/memberships/active");

export const fetchPendingMemberships = () =>
    get<Membership[]>("/api/memberships/pending");

export const requestMembership = (tenantId: string) =>
    post<void>("/api/memberships", { tenantId });

export const selectMembership = (membershipId: string) =>
    post<void>("/api/memberships/select", { membershipId });

export const approveMembership = (id: string) =>
    post<void>(`/api/memberships/${id}/approve`);

export const rejectMembership = (id: string) =>
    post<void>(`/api/memberships/${id}/reject`);

export const revokeMembership = (id: string) =>
    post<void>(`/api/memberships/${id}/revoke`);

export const updateMembershipRole = (
    id: string,
    role: "customer" | "staff" | "admin"
) =>
    patch<void>(`/api/admin/memberships/${id}/role`, { role });

export const fetchMemberships = () =>
    get<MembershipView[]>("/api/memberships");

export const getMembership = (id: string) =>
    get<MembershipView>(`/api/memberships/${id}`);

export const fetchMyMemberships = () =>
    get<MembershipView[]>("/api/memberships/me");