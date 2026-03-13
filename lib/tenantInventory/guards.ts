// lib/tenantInventory/guards.ts

import type { TenantInventory } from "@/types/tenantInventory";
import { ProvisionNotFoundError } from "./errors";

export function requireProvision(
    record: TenantInventory | undefined,
    productId: string
): asserts record is TenantInventory {
    if (!record) {
        throw new ProvisionNotFoundError(productId);
    }
}