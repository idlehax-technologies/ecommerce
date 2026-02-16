import { NextResponse } from "next/server";

import { getPublicProduct } from "@/lib/products/domain";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { getUserFromRequest } from "@/lib/auth";
import { requireAuth, requireTenant } from "@/lib/auth/guards";

export async function GET(
  _req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const rawUser = await getUserFromRequest();
    const actor = requireTenant(rawUser);

    const product = await getPublicProduct(actor, params.productId);

    return NextResponse.json({ product });
  } catch (err: unknown) {
    return handleRouteError(err);
  }
}
