import { NextResponse } from "next/server";

import { requireSuperadmin } from "@/lib/auth/guards";

import { updatePlatformProduct } from "@/lib/products/service";

import { validateUpdateProduct } from "@/lib/products/validators";

import { handleRouteError } from "@/lib/http/handleRouteError";
import { guardRequest } from "@/lib/security/requestGuard";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    const user = await guardRequest(req, {
      requireAuth: true,
      csrf: true,
    });
    requireSuperadmin(user);

    const body: unknown = await req.json();
    validateUpdateProduct(body);

    const product = await updatePlatformProduct(productId, body);

    return NextResponse.json({ product });
  } catch (err: unknown) {
    return handleRouteError(err);
  }
}