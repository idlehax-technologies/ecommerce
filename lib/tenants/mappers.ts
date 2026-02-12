import { CreateTenantDTO, Tenant, PublicTenant } from "@/types/tenant";
import crypto from "crypto";

export function toNewTenant(dto: CreateTenantDTO): Tenant {
    const now = new Date().toISOString();

    return {
        tenantId: crypto.randomUUID(),
        name: dto.name.trim(),
        status: "created",
        createdAt: now,
        updatedAt: now,
    };
}

export function toPublicTenant(t: Tenant): PublicTenant {
    return {
        tenantId: t.tenantId,
        name: t.name,
        status: t.status,
    };
}
