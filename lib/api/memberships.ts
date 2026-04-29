import { apiFetch } from "./fetch";
import { Membership, MembershipView } from "@/types/membership";

export const fetchActiveMembership = () =>
    apiFetch<{ membership: Membership | null }>("/api/memberships/active");

export const fetchPendingMemberships = () =>
    apiFetch<MembershipView[]>("/api/memberships/pending");

export const requestMembership = (tenantId: string) =>
    apiFetch("/api/memberships", {
        method: "POST",
        body: JSON.stringify({ tenantId }),
    });

export const selectMembership = (membershipId: string) =>
    apiFetch("/api/memberships/select", {
        method: "POST",
        body: JSON.stringify({ membershipId }),
    });

export const approveMembership = (id: string) =>
    apiFetch(`/api/memberships/${id}/approve`, { method: "POST" });

export const rejectMembership = (id: string) =>
    apiFetch(`/api/memberships/${id}/reject`, { method: "POST" });

export const revokeMembership = (id: string) =>
    apiFetch(`/api/memberships/${id}/revoke`, { method: "POST" });

export const updateMembershipRole = (
    id: string,
    role: "customer" | "staff" | "admin"
) =>
    apiFetch(`/api/admin/memberships/${id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
    });

export const fetchMemberships = () =>
    apiFetch<MembershipView[]>("/api/memberships");

export const getMembership = (id: string) =>
    apiFetch<MembershipView>(`/api/memberships/${id}`);

export const fetchMyMemberships = () =>
    apiFetch<MembershipView[]>("/api/memberships/me");