import { tenantStore } from "./storage";
import { toNewTenant, toPublicTenant } from "./mappers";
import { assertExists, assertCanActivate, assertCanDeactivate, assertDoesNotExist } from "./guards";
import { CreateTenantDTO, PublicTenant } from "@/types/tenant";

export function createTenant(dto: CreateTenantDTO): PublicTenant {
    const t = toNewTenant(dto);

    const existing = tenantStore.get(t.tenantId);
    assertDoesNotExist(existing);

    tenantStore.save(t);

    return toPublicTenant(t);
}

export function listTenants(): PublicTenant[] {
    return tenantStore.getAll().map(toPublicTenant);
}

export function getTenant(id: string): PublicTenant | null {
    const t = tenantStore.get(id);
    assertExists(t);

    return toPublicTenant(t);
}

export function activateTenant(id: string): PublicTenant {
    const current = tenantStore.get(id);
    assertExists(current);

    assertCanActivate(current);

    const updated = {
        ...current,
        status: "active" as const,
        updatedAt: new Date().toISOString(),
    };

    tenantStore.save(updated);

    return toPublicTenant(updated);
}

export function deactivateTenant(id: string): PublicTenant {
    const current = tenantStore.get(id);
    assertExists(current);

    assertCanDeactivate(current);

    const updated = {
        ...current,
        status: "inactive" as const,
        updatedAt: new Date().toISOString(),
    };

    tenantStore.save(updated);

    return toPublicTenant(updated);
}