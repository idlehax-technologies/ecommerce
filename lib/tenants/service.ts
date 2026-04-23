// ==============================
// lib/tenants/service.ts (FIXED FOR MEMBERSHIP + SUPERADMIN MODEL)
// ==============================

import "server-only";

import {
    createTenant,
    listTenants,
    getTenant,
    activateTenant,
    suspendTenant,
    archiveTenant,
} from "./domain";

import { assertCreateTenantDTO } from "./validators";
import { getUserFromRequest } from "@/lib/auth";
import { requireSuperadmin } from "@/lib/auth/guards";
import { CreateTenantDTO, PublicTenant } from "@/types/tenant";

import { cookies } from "next/headers";
import { signToken } from "@/lib/jwt";
import { getAdminMembershipForTenant } from "../memberships/domain";

const SEVEN_DAYS = 60 * 60 * 24 * 7;

/* -------------------------------------------------------------------------- */
/* READ                                                                        */
/* -------------------------------------------------------------------------- */

export async function listAllTenants(): Promise<PublicTenant[]> {
    const user = requireSuperadmin(await getUserFromRequest());
    return listTenants();
}

export async function getTenantById(
    tenantId: string
): Promise<PublicTenant> {
    const user = requireSuperadmin(await getUserFromRequest());
    return getTenant(tenantId);
}

/* -------------------------------------------------------------------------- */
/* WRITE                                                                       */
/* -------------------------------------------------------------------------- */

export async function createTenantUseCase(
    body: unknown
): Promise<PublicTenant> {
    const user = requireSuperadmin(await getUserFromRequest());

    assertCreateTenantDTO(body);

    return createTenant(body as CreateTenantDTO);
}

export async function activateTenantUseCase(tenantId: string) {
    const user = requireSuperadmin(await getUserFromRequest());
    return activateTenant(tenantId);
}

export async function suspendTenantUseCase(tenantId: string) {
    const user = requireSuperadmin(await getUserFromRequest());
    return suspendTenant(tenantId);
}

export async function archiveTenantUseCase(tenantId: string) {
    const user = requireSuperadmin(await getUserFromRequest());
    return archiveTenant(tenantId);
}

/* -------------------------------------------------------------------------- */
/* IMPERSONATION                                                               */
/* -------------------------------------------------------------------------- */

export async function assumeTenantAdminUseCase(tenantId: string) {
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

    return { success: true };
}