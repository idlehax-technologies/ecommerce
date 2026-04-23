import { NextResponse } from "next/server";

import { getUserFromRequest } from "@/lib/auth";
import { requireSuperadmin } from "@/lib/auth/guards";

import {
  getPlatformProduct,
  updatePlatformProduct,
  deletePlatformProduct,
} from "@/lib/products/service";

import { validateUpdateProduct } from "@/lib/products/validators";
import type { UpdateProductDTO } from "@/types/product";

import { handleRouteError } from "@/lib/http/handleRouteError";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    const rawUser = await getUserFromRequest();
    requireSuperadmin(rawUser);

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

    const rawUser = await getUserFromRequest();
    requireSuperadmin(rawUser);

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
  _req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    const rawUser = await getUserFromRequest();
    requireSuperadmin(rawUser);

    await deletePlatformProduct(productId);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return handleRouteError(err);
  }
}