// lib/tenants.ts

import type { Tenant } from "@/types/tenant";

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
  input: { name: string }
): Promise<Tenant> {
  const tenantId = crypto.randomUUID();

  const tenant: Tenant = {
    tenantId,
    name: input.name,
  };

  tenants.set(tenantId, tenant);

  return tenant;
}

/**
 * Update tenant metadata
 */
export async function updateTenant(
  tenantId: string,
  patch: Partial<Pick<Tenant, "name">>
): Promise<Tenant | null> {
  const existing = tenants.get(tenantId);
  if (!existing) return null;

  const updated = { ...existing, ...patch };
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
