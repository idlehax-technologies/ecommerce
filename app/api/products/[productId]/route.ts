import { NextResponse } from "next/server";
import { getPublicProductById } from "@/lib/products/domain";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { getUserFromRequest } from "@/lib/auth";
import { requireAuth } from "@/lib/auth/guards";

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
    const rawUser = await getUserFromRequest();
    requireAuth(rawUser);

    const { productId } = await params;
    const product = await getPublicProductById(productId);

    return NextResponse.json({ product });
  } catch (err: unknown) {
    return handleRouteError(err);
  }
}
