import { NextResponse } from "next/server";

import { getAllPublicProducts } from "@/lib/products/domain";
import { ProductDomainError } from "@/lib/products/errors";

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
    const products = await getAllPublicProducts();

    return NextResponse.json({ products });
  } catch (e) {
    if (e instanceof ProductDomainError) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }

    console.error(e);

    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
