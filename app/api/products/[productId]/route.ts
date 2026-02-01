import { NextResponse } from "next/server";
import { getPublicProductById } from "@/lib/products";

/**
 * GET /api/products/[productId]
 *
 * Public single-product endpoint.
 * Same rules as catalog:
 * - no auth
 * - only active
 * - not deleted
 * - hides vendorId
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const product = await getPublicProductById(productId);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { product },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to load product" },
      { status: 500 }
    );
  }
}
