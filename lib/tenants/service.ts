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
import { requireAuth } from "@/lib/auth/guards";
import { CreateTenantDTO, PublicTenant } from "@/types/tenant";

import { cookies } from "next/headers";
import { signToken } from "@/lib/jwt";

const SEVEN_DAYS = 60 * 60 * 24 * 7;

/* -------------------------------------------------------------------------- */
/* READ                                                                        */
/* -------------------------------------------------------------------------- */

export async function listAllTenants(): Promise<PublicTenant[]> {
    const user = requireAuth(await getUserFromRequest());

    if (user.role !== "superadmin") throw new Error("Forbidden");

    return listTenants();
}

export async function getTenantById(tenantId: string): Promise<PublicTenant> {
    const user = requireAuth(await getUserFromRequest());

    if (user.role !== "superadmin") throw new Error("Forbidden");

    return getTenant(tenantId);
}

/* -------------------------------------------------------------------------- */
/* WRITE                                                                       */
/* -------------------------------------------------------------------------- */

export async function createTenantUseCase(body: unknown): Promise<PublicTenant> {
    const user = requireAuth(await getUserFromRequest());

    if (user.role !== "superadmin") throw new Error("Forbidden");

    assertCreateTenantDTO(body);

    return createTenant(body as CreateTenantDTO);
}

export async function activateTenantUseCase(tenantId: string) {
    const user = requireAuth(await getUserFromRequest());

    if (user.role !== "superadmin") throw new Error("Forbidden");

    return activateTenant(tenantId);
}

export async function suspendTenantUseCase(tenantId: string) {
    const user = requireAuth(await getUserFromRequest());

    if (user.role !== "superadmin") throw new Error("Forbidden");

    return suspendTenant(tenantId);
}

export async function archiveTenantUseCase(tenantId: string) {
    const user = requireAuth(await getUserFromRequest());

    if (user.role !== "superadmin") throw new Error("Forbidden");

    return archiveTenant(tenantId);
}

/* -------------------------------------------------------------------------- */
/* IMPERSONATION                                                               */
/* -------------------------------------------------------------------------- */

export async function assumeTenantAdminUseCase(tenantId: string) {
    const user = requireAuth(await getUserFromRequest());

    if (user.role !== "superadmin") throw new Error("Forbidden");

    const token = signToken({
        userId: user.userId,
        phone: user.phone,
        role: "admin",
        tenantId,
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