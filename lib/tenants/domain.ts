import { tenantStore } from "./storage";
import { toNewTenant, toPublicTenant } from "./mappers";
import {
    assertExists,
    assertCanActivate,
    assertCanSuspend,
    assertCanArchive,
    assertDoesNotExist,
} from "./guards";
import { CreateTenantDTO, PublicTenant } from "@/types/tenant";

/**
 * Create → always PENDING
 */
export function createTenant(dto: CreateTenantDTO): PublicTenant {
    const t = toNewTenant(dto);

    const existing = tenantStore.get(t.tenantId);
    assertDoesNotExist(existing);

    const now = new Date().toISOString();

    const tenant = {
        ...t,
        status: "PENDING" as const,
        createdAt: now,
        updatedAt: now,
    };

    tenantStore.save(tenant);

    return toPublicTenant(tenant);
}

export function listTenants(): PublicTenant[] {
    return tenantStore.getAll().map(toPublicTenant);
}

export function getTenant(id: string): PublicTenant {
    const t = tenantStore.get(id);
    assertExists(t);

    return toPublicTenant(t);
}

/**
 * PENDING | SUSPENDED → ACTIVE
 */
export function activateTenant(id: string): PublicTenant {
    const current = tenantStore.get(id);
    assertExists(current);

    assertCanActivate(current);

    const updated = {
        ...current,
        status: "ACTIVE" as const,
        updatedAt: new Date().toISOString(),
    };

    tenantStore.save(updated);

    return toPublicTenant(updated);
}

/**
 * ACTIVE → SUSPENDED
 */
export function suspendTenant(id: string): PublicTenant {
    const current = tenantStore.get(id);
    assertExists(current);

    assertCanSuspend(current);

    const updated = {
        ...current,
        status: "SUSPENDED" as const,
        updatedAt: new Date().toISOString(),
    };

    tenantStore.save(updated);

    return toPublicTenant(updated);
}

/**
 * ANY (except ARCHIVED) → ARCHIVED
 */
export function archiveTenant(id: string): PublicTenant {
    const current = tenantStore.get(id);
    assertExists(current);

    assertCanArchive(current);

    const updated = {
        ...current,
        status: "ARCHIVED" as const,
        updatedAt: new Date().toISOString(),
    };

    tenantStore.save(updated);

    return toPublicTenant(updated);
}