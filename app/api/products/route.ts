import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/auth/guards";
import { getUserFromRequest } from "@/lib/auth";

import { listProducts } from "@/lib/products/domain";
import { listTenantInventory } from "@/lib/tenantInventory/domain";

export async function GET() {
  const actor = requireTenant(await getUserFromRequest());

  const products = await listProducts();
  const inventory = listTenantInventory(actor.tenantId);

  const visible = products.filter(p =>
    inventory.some(i => i.productId === p.productId && i.enabled)
  );

  return NextResponse.json({ products: visible });
}
