// lib/tenants.ts

import type { Tenant, CreateTenantDTO, UpdateTenantDTO } from "@/types/tenant";

/**
 * TEMP in-memory store
 * Replace with DB later
 */
const tenants = new Map<string, Tenant>([
  [
    "demo-school",
    {
      tenantId: "demo-school",
      name: "Demo School",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
]);


/**
 * Get tenant by id
 * Pure lookup — no auth logic, no user logic
 */
export async function getTenantById(
  tenantId: string
): Promise<Tenant | null> {
  return tenants.get(tenantId) ?? null;
}


/**
 * List all tenants (admin usage only)
 */
export async function listTenants(): Promise<Tenant[]> {
  return Array.from(tenants.values());
}


/**
 * Create a new tenant (superadmin flow)
 */
export async function createTenant(
  input: CreateTenantDTO
): Promise<Tenant> {
  const tenantId = crypto.randomUUID();
  const now = new Date().toISOString();

  const tenant: Tenant = {
    tenantId,
    name: input.name,
    status: "created",
    createdAt: now,
    updatedAt: now,
  };

  tenants.set(tenantId, tenant);

  return tenant;
}


/**
 * Update tenant metadata
 */
export async function updateTenant(
  tenantId: string,
  input: UpdateTenantDTO
): Promise<Tenant | null> {
  const existing = tenants.get(tenantId);
  if (!existing) return null;

  const updated: Tenant = {
    ...existing,
    ...input,
    updatedAt: new Date().toISOString(),
  };
  tenants.set(tenantId, updated);

  return updated;
}


export async function activateTenant(
  tenantId: string
): Promise<Tenant | null> {
  const t = tenants.get(tenantId);
  if (!t) return null;

  const updated: Tenant = {
    ...t,
    status: "active",
    updatedAt: new Date().toISOString(),
  };

  tenants.set(tenantId, updated);
  return updated;
}


export async function deactivateTenant(
  tenantId: string
): Promise<Tenant | null> {
  const t = tenants.get(tenantId);
  if (!t) return null;

  const updated: Tenant = {
    ...t,
    status: "inactive",
    updatedAt: new Date().toISOString(),
  };

  tenants.set(tenantId, updated);
  return updated;
}


/**
 * Delete tenant (rare / admin only)
 */
export async function deleteTenant(
  tenantId: string
): Promise<boolean> {
  return tenants.delete(tenantId);
}
