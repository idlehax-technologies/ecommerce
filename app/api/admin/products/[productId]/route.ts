import { NextResponse } from "next/server";

import { getUserFromRequest } from "@/lib/auth";

import {
  getProductById,
  updateProduct,
  softDeleteProduct,
} from "@/lib/products/domain";

import {
  validateUpdateProduct,
} from "@/lib/products/validators";

import {
  toUpdateProductPatch,
} from "@/lib/products/mappers";

import type { UpdateProductPatch } from "@/types/product";
import { requireRole } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";


// ============================================
// GET /api/admin/products/:productId
// ============================================
export async function GET(
  _req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const rawUser = await getUserFromRequest();
    const user = requireRole(rawUser, "staff");

    const product = await getProductById(
      params.productId,
      user.tenantId!
    );

    return NextResponse.json({ product });
  } catch (err: unknown) {
    return handleRouteError(err);
  }
}


// ============================================
// PATCH /api/admin/products/:productId
// ============================================
export async function PATCH(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const rawUser = await getUserFromRequest();
    const user = requireRole(rawUser, "staff");

    const body: unknown = await req.json();

    validateUpdateProduct(body);

    const dto = body as UpdateProductPatch;

    const patch = toUpdateProductPatch(dto);

    const product = await updateProduct(
      params.productId,
      user.tenantId!,
      patch
    );

    return NextResponse.json({ product });
  } catch (err: unknown) {
    return handleRouteError(err);
  }
}


// ============================================
// DELETE /api/admin/products/:productId
// ============================================
export async function DELETE(
  _req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const rawUser = await getUserFromRequest();
    const user = requireRole(rawUser, "staff");

    await softDeleteProduct(params.productId, user.tenantId!);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return handleRouteError(err);
  }
}
