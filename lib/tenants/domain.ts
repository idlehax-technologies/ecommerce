import { tenantStore } from "./storage";
import { toNewTenant, toPublicTenant } from "./mappers";
import { assertExists, assertCanActivate, assertCanDeactivate } from "./guards";
import { CreateTenantDTO, PublicTenant } from "@/types/tenant";

export function createTenant(dto: CreateTenantDTO): PublicTenant {
    const t = toNewTenant(dto);
    tenantStore.save(t);
    return toPublicTenant(t);
}

export function listTenants(): PublicTenant[] {
    return tenantStore.getAll().map(toPublicTenant);
}

export function getTenant(id: string): PublicTenant {
    const t = tenantStore.get(id);
    assertExists(t);
    return toPublicTenant(t);
}

export function activateTenant(id: string): PublicTenant {
    const t = tenantStore.get(id);
    assertExists(t);

    assertCanActivate(t);

    t.status = "active";
    t.updatedAt = new Date().toISOString();

    tenantStore.save(t);

    return toPublicTenant(t);
}

export function deactivateTenant(id: string): PublicTenant {
    const t = tenantStore.get(id);
    assertExists(t);

    assertCanDeactivate(t);

    t.status = "inactive";
    t.updatedAt = new Date().toISOString();

    tenantStore.save(t);

    return toPublicTenant(t);
}
