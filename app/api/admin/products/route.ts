import { NextResponse } from "next/server";

import { requireSuperadmin } from "@/lib/auth/guards";

import { createPlatformProduct } from "@/lib/products/service";

import { validateCreateProduct } from "@/lib/products/validators";

import { handleRouteError } from "@/lib/http/handleRouteError";
import { guardRequest } from "@/lib/security/requestGuard";

export async function POST(req: Request) {
  try {
    const user = await guardRequest(req, {
      requireAuth: true,
      csrf: true,
    });
    requireSuperadmin(user);

    const body: unknown = await req.json();
    validateCreateProduct(body);

    const product = await createPlatformProduct(body);

    return NextResponse.json({ product });
  } catch (err: unknown) {
    return handleRouteError(err);
  }
}