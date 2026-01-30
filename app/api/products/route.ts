import { NextResponse } from "next/server";
import { getAllPublicProducts } from "@/lib/products";

/**
 * GET /api/products
 *
 * Public storefront catalog.
 *
 * Rules:
 * - No auth required
 * - No vendor scoping
 * - Only active products
 * - Exclude soft-deleted products
 * - Never expose vendorId
 */
export async function GET(_req: Request) {
  try {
    const products = await getAllPublicProducts();

    return NextResponse.json(
      { products },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 500 }
    );
  }
}
