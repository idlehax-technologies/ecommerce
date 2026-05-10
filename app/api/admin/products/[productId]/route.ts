import { NextResponse } from "next/server";

import { requireSuperadmin } from "@/lib/auth/guards";

import {
  getPlatformProduct,
  updatePlatformProduct,
  deletePlatformProduct,
} from "@/lib/products/service";

import { validateUpdateProduct } from "@/lib/products/validators";
import type { UpdateProductDTO } from "@/types/product";

import { handleRouteError } from "@/lib/http/handleRouteError";
import { guardRequest } from "@/lib/security/requestGuard";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    const user = await guardRequest(req, { requireAuth: true });
    requireSuperadmin(user);

    const product = await getPlatformProduct(productId);

    return NextResponse.json({ product });
  } catch (err: unknown) {
    return handleRouteError(err);
  }
}

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

    const dto = body as UpdateProductDTO;

    const product = await updatePlatformProduct(productId, dto);

    return NextResponse.json({ product });
  } catch (err: unknown) {
    return handleRouteError(err);
  }
}

export async function DELETE(
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

    await deletePlatformProduct(productId);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return handleRouteError(err);
  }
}