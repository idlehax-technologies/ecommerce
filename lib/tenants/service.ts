import {
    createTenant,
    listTenants,
    getTenant,
    activateTenant,
    suspendTenant,
    archiveTenant,
    updateTenant,
} from "./domain";

import { getUserFromRequest } from "@/lib/auth";
import { requireSuperadmin } from "@/lib/auth/guards";
import { CreateTenantDTO, Tenant, UpdateTenantDTO } from "@/types/tenant";

import { cookies } from "next/headers";
import { signToken } from "@/lib/jwt";
import { getAdminMembershipForTenant } from "../memberships/domain";

const SEVEN_DAYS = 60 * 60 * 24 * 7;

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

    const adminMembership = getAdminMembershipForTenant(tenantId);

    const token = signToken({
        userId: adminMembership.userId,
        phone: user.phone,
        activeMembershipId: adminMembership.membershipId,
        isSuperadmin: false,
        impersonatedBy: user.userId,
    });

    const cookieStore = await cookies();

    cookieStore.set("auth", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SEVEN_DAYS,
    });
}