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
    return listTenants();
}

export async function getTenantById(
    tenantId: string
): Promise<PublicTenant> {
    return getTenant(tenantId);
}

/* -------------------------------------------------------------------------- */
/* WRITE                                                                       */
/* -------------------------------------------------------------------------- */

export async function createTenantUseCase(
    body: unknown
): Promise<PublicTenant> {
    assertCreateTenantDTO(body);
    return createTenant(body as CreateTenantDTO);
}

export async function activateTenantUseCase(tenantId: string) {
    return activateTenant(tenantId);
}

export async function suspendTenantUseCase(tenantId: string) {
    return suspendTenant(tenantId);
}

export async function archiveTenantUseCase(tenantId: string) {
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