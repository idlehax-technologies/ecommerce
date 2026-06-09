import { tenantStore } from "./storage";
import { toNewTenant, toPublicTenant, toUpdatedTenant } from "./mappers";
import {
    assertExists,
    assertCanActivate,
    assertCanSuspend,
    assertCanArchive,
} from "./guards";
import type {
    CreateTenantDTO,
    PublicTenant,
    Tenant,
    UpdateTenantDTO,
} from "@/types/tenant";

function now(): string {
    return new Date().toISOString();
}

/**
 * Create → always PENDING
 */
export async function createTenant(
    dto: CreateTenantDTO
): Promise<Tenant> {

    const tenant = toNewTenant(dto);

    tenantStore.save(tenant);

    return tenant;
}

export async function listTenants(): Promise<Tenant[]> {
    return tenantStore.getAll();
}

export async function listActiveTenants(): Promise<PublicTenant[]> {
    return tenantStore
        .getAll()
        .filter((t) => t.status === "ACTIVE")
        .map(toPublicTenant);
}

export async function getTenant(tenantId: string): Promise<Tenant> {
    const tenant = tenantStore.get(tenantId);
    assertExists(tenant);

    return tenant;
}

export async function updateTenant(
    tenantId: string,
    dto: UpdateTenantDTO
): Promise<Tenant> {
    const current = await getTenant(tenantId);

    const updated = toUpdatedTenant(current, dto);

    tenantStore.save(updated);

    return updated;
}

/**
 * PENDING | SUSPENDED → ACTIVE
 */
export async function activateTenant(tenantId: string): Promise<Tenant> {
    const current = await getTenant(tenantId);

    assertCanActivate(current);

    const updated: Tenant = {
        ...current,
        status: "ACTIVE",
        updatedAt: now(),
    };

    tenantStore.save(updated);

    return updated;
}

/**
 * ACTIVE → SUSPENDED
 */
export async function suspendTenant(tenantId: string): Promise<Tenant> {
    const current = await getTenant(tenantId);

    assertCanSuspend(current);

    const updated: Tenant = {
        ...current,
        status: "SUSPENDED",
        updatedAt: now(),
    };

    tenantStore.save(updated);

    return updated;
}

/**
 * ANY (except ARCHIVED) → ARCHIVED
 */
export async function archiveTenant(tenantId: string): Promise<Tenant> {
    const current = await getTenant(tenantId);

    assertCanArchive(current);

    const updated: Tenant = {
        ...current,
        status: "ARCHIVED",
        updatedAt: now(),
    };

    tenantStore.save(updated);

    return updated;
}