// app/api/admin/products/[productId]/route.ts

import { NextResponse } from "next/server";

import { getUserFromRequest } from "@/lib/auth";
import { requireRole } from "@/lib/auth/guards";

import {
  getProduct,
  updateProduct,
  softDeleteProduct,
} from "@/lib/products/domain";

import { validateUpdateProduct } from "@/lib/products/validators";

import type { UpdateProductDTO } from "@/types/product";

import { handleRouteError } from "@/lib/http/handleRouteError";

/**
 * Admin Product Mutation Surface
 *
 * Still platform-owned.
 * No tenant resolution required anymore.
 */

export async function GET(
  _req: Request,
  context: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await context.params;

    const rawUser = await getUserFromRequest();
    requireRole(rawUser, "superadmin");

    const product = await getProduct(productId);

    return NextResponse.json({ product });
  } catch (err: unknown) {
    return handleRouteError(err);
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await context.params;

    const rawUser = await getUserFromRequest();
    requireRole(rawUser, "superadmin");

    const body: unknown = await req.json();
    validateUpdateProduct(body);

    const dto = body as UpdateProductDTO;

    const product = await updateProduct(productId, dto);

    return NextResponse.json({ product });
  } catch (err: unknown) {
    return handleRouteError(err);
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await context.params;

    const rawUser = await getUserFromRequest();
    requireRole(rawUser, "superadmin");

    await softDeleteProduct(productId);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return handleRouteError(err);
  }
}