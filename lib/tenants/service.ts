// lib/tenants/service.ts

import "server-only";

import {
    createTenant,
    listTenants,
    getTenant,
    activateTenant,
    deactivateTenant,
} from "./domain";

import { assertCreateTenantDTO } from "./validators";
import { getUserFromRequest } from "@/lib/auth";
import { requireAuth } from "@/lib/auth/guards";
import { CreateTenantDTO, PublicTenant } from "@/types/tenant";

/**
 * Application Service for Tenant Feature
 *
 * Responsibilities:
 * - Authorization (who may execute the use-case)
 * - Validation orchestration
 * - Domain coordination
 * - Never knows HTTP / NextResponse / Request objects
 *
 * Routes and SSR pages both call this.
 */

/* -------------------------------------------------------------------------- */
/* READ USE-CASES                                                              */
/* -------------------------------------------------------------------------- */

export async function listAllTenants(): Promise<PublicTenant[]> {
    const user = requireAuth(await getUserFromRequest());

    if (user.role !== "superadmin") {
        throw new Error("Forbidden");
    }

    return listTenants();
}

export async function getTenantById(tenantId: string): Promise<PublicTenant> {
    const user = requireAuth(await getUserFromRequest());

    if (user.role !== "superadmin") {
        throw new Error("Forbidden");
    }

    const tenant = getTenant(tenantId);
    if (!tenant) throw new Error("Tenant not found");

    return tenant;
}

/* -------------------------------------------------------------------------- */
/* WRITE USE-CASES                                                             */
/* -------------------------------------------------------------------------- */

export async function createTenantUseCase(body: unknown): Promise<PublicTenant> {
    const user = requireAuth(await getUserFromRequest());

    if (user.role !== "superadmin") {
        throw new Error("Forbidden");
    }

    assertCreateTenantDTO(body);

    const dto: CreateTenantDTO = body;

    return createTenant(dto);
}

export async function activateTenantUseCase(tenantId: string): Promise<PublicTenant> {
    const user = requireAuth(await getUserFromRequest());

    if (user.role !== "superadmin") {
        throw new Error("Forbidden");
    }

    return activateTenant(tenantId);
}

export async function deactivateTenantUseCase(tenantId: string): Promise<PublicTenant> {
    const user = requireAuth(await getUserFromRequest());

    if (user.role !== "superadmin") {
        throw new Error("Forbidden");
    }

    return deactivateTenant(tenantId);
}

/* -------------------------------------------------------------------------- */
/* IMPERSONATION USE-CASE                                                      */
/* -------------------------------------------------------------------------- */

import { cookies } from "next/headers";
import { signToken } from "@/lib/jwt";

const SEVEN_DAYS = 60 * 60 * 24 * 7;

export async function assumeTenantAdminUseCase(tenantId: string) {
    const user = requireAuth(await getUserFromRequest());

    if (user.role !== "superadmin") {
        throw new Error("Forbidden");
    }

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