import { NextResponse } from "next/server";

import { getAllPublicProducts } from "@/lib/products/domain";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { getUserFromRequest } from "@/lib/auth";
import { requireAuth } from "@/lib/auth/guards";

/**
 * Public storefront
 * GET /api/products
 *
 * No auth
 * No tenant scoping
 * No validators
 * Domain already filters:
 *   - isActive
 *   - not deleted
 *   - stock > 0
 *   - strips tenantId
 */
export async function GET() {
  try {
    const rawUser = await getUserFromRequest();
    requireAuth(rawUser);

    const products = await getAllPublicProducts();

    return NextResponse.json({ products });
  } catch (err: unknown) {
    return handleRouteError(err);
  }
}
