import type {
    CreateTenantDTO,
    Tenant,
    PublicTenant,
    UpdateTenantDTO,
} from "@/types/tenant";

import crypto from "crypto";

function now(): string {
    return new Date().toISOString();
}

export function toNewTenant(dto: CreateTenantDTO): Tenant {
    const timestamp = now();

    return {
        tenantId: crypto.randomUUID(),

        name: dto.name.trim(),

        address: dto.address.trim(),
        state: dto.state,

        gstin: dto.gstin?.trim() || undefined,

        status: "PENDING",

        createdAt: timestamp,
        updatedAt: timestamp,
    };
}

export function toUpdatedTenant(
    existing: Tenant,
    dto: UpdateTenantDTO
): Tenant {
    return {
        ...existing,

        ...(dto.name !== undefined && {
            name: dto.name.trim(),
        }),

        ...(dto.address !== undefined && {
            address: dto.address.trim(),
        }),

        ...(dto.state !== undefined && {
            state: dto.state,
        }),

        ...(dto.gstin !== undefined && {
            gstin: dto.gstin.trim() || undefined,
        }),

        updatedAt: now(),
    };
}

export function toPublicTenant(t: Tenant): PublicTenant {
    return {
        tenantId: t.tenantId,

        name: t.name,

        address: t.address,
        state: t.state,

        gstin: t.gstin,

        status: t.status,
    };
}