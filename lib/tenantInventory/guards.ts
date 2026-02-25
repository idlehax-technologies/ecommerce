// lib/tenantInventory/guards.ts

import type { TenantInventory } from "@/types/tenantInventory";
import { ProvisionNotFoundError } from "./errors";

export function requireProvision(
    record: TenantInventory | undefined,
    productId: string
): TenantInventory {
    if (!record) {
        throw new ProvisionNotFoundError(productId);
    }
    return record;
}