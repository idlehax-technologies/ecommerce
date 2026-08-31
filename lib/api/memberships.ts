import { apiFetch } from "./fetch";

import type {
    Membership,
    MembershipRole,
    MembershipView,
} from "@/types/membership";

export async function fetchActiveMembership(): Promise<{
    membership: Membership | null;
}> {
    return apiFetch<{ membership: Membership | null }>(
        "/api/memberships/active"
    );
}

export async function requestMembership(
    tenantId: string
): Promise<{
    membership: Membership;
}> {
    return apiFetch<{ membership: Membership }>(
        "/api/memberships",
        {
            method: "POST",
            body: JSON.stringify({ tenantId }),
        }
    );
}

export async function selectMembership(
    membershipId: string
): Promise<{ success: true }> {
    return apiFetch<{ success: true }>(
        "/api/memberships/select",
        {
            method: "POST",
            body: JSON.stringify({ membershipId }),
        }
    );
}

export async function approveMembership(
    membershipId: string
): Promise<{ success: true }> {
    return apiFetch<{ success: true }>(
        `/api/memberships/${membershipId}/approve`,
        {
            method: "POST",
        }
    );
}

export async function rejectMembership(
    membershipId: string
): Promise<{ success: true }> {
    return apiFetch<{ success: true }>(
        `/api/memberships/${membershipId}/reject`,
        {
            method: "POST",
        }
    );
}

export async function revokeMembership(
    membershipId: string
): Promise<{ success: true }> {
    return apiFetch<{ success: true }>(
        `/api/memberships/${membershipId}/revoke`,
        {
            method: "POST",
        }
    );
}

export async function updateMembershipRole(
    membershipId: string,
    role: MembershipRole
): Promise<{ success: true }> {
    return apiFetch<{ success: true }>(
        `/api/admin/memberships/${membershipId}/role`,
        {
            method: "PATCH",
            body: JSON.stringify({ role }),
        }
    );
}

export async function fetchMemberships(): Promise<{
    memberships: MembershipView[];
}> {
    return apiFetch<{ memberships: MembershipView[] }>(
        "/api/memberships"
    );
}

export async function getMembership(
    membershipId: string
): Promise<{
    membership: MembershipView;
}> {
    return apiFetch<{ membership: MembershipView }>(
        `/api/memberships/${membershipId}`
    );
}

export async function fetchMyMemberships(): Promise<{
    memberships: MembershipView[];
}> {
    return apiFetch<{ memberships: MembershipView[] }>(
        "/api/memberships/me"
    );
}