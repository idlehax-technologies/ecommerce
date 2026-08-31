import { cookies } from "next/headers";

import {
    createTenant,
    listTenants,
    getTenant,
    activateTenant,
    suspendTenant,
    archiveTenant,
    updateTenant,
} from "./domain";

import {
    getAdminMembershipForTenant,
    getStaffMembershipForTenant,
} from "@/lib/memberships/domain";

import { getUserFromRequest } from "@/lib/session/session";
import { requireSuperadmin } from "@/lib/auth/guards";

import { signToken } from "@/lib/session/jwt";
import { AUTH_COOKIE, AUTH_COOKIE_OPTIONS } from "@/lib/auth/cookies";

import { CreateTenantDTO, Tenant, UpdateTenantDTO } from "@/types/tenant";

/* -------------------------------------------------------------------------- */
/* READ                                                                        */
/* -------------------------------------------------------------------------- */

export async function listAllTenants(): Promise<Tenant[]> {
    return listTenants();
}

export async function getTenantById(
    tenantId: string
): Promise<Tenant> {
    return getTenant(tenantId);
}

/* -------------------------------------------------------------------------- */
/* WRITE                                                                       */
/* -------------------------------------------------------------------------- */

export async function createTenantUseCase(
    dto: CreateTenantDTO
): Promise<Tenant> {
    return createTenant(dto);
}

export async function updateTenantUseCase(
    tenantId: string,
    dto: UpdateTenantDTO
): Promise<Tenant> {
    return updateTenant(tenantId, dto);
}

export async function activateTenantUseCase(
    tenantId: string
): Promise<Tenant> {
    return activateTenant(tenantId);
}

export async function suspendTenantUseCase(
    tenantId: string
): Promise<Tenant> {
    return suspendTenant(tenantId);
}

export async function archiveTenantUseCase(
    tenantId: string
): Promise<Tenant> {
    return archiveTenant(tenantId);
}

/* -------------------------------------------------------------------------- */
/* IMPERSONATION                                                               */
/* -------------------------------------------------------------------------- */

export async function assumeTenantAdminUseCase(
    tenantId: string
): Promise<void> {
    const user = requireSuperadmin(await getUserFromRequest());

    const adminMembership = await getAdminMembershipForTenant(tenantId);

    const token = signToken({
        userId: adminMembership.userId,
        phone: user.phone,
        isSuperadmin: false,
        activeMembershipId: adminMembership.membershipId,
        impersonatedBy: user.userId,
    });

    const cookieStore = await cookies();

    cookieStore.set(AUTH_COOKIE, token, AUTH_COOKIE_OPTIONS);
}

export async function assumeTenantStaffUseCase(
    tenantId: string
): Promise<void> {
    const user = requireSuperadmin(await getUserFromRequest());

    const staffMembership = await getStaffMembershipForTenant(tenantId);

    const token = signToken({
        userId: staffMembership.userId,
        phone: user.phone,
        isSuperadmin: false,
        activeMembershipId: staffMembership.membershipId,
        impersonatedBy: user.userId,
    });

    const cookieStore = await cookies();

    cookieStore.set(AUTH_COOKIE, token, AUTH_COOKIE_OPTIONS);
}