import { NextResponse } from "next/server";

import { getUserFromRequest } from "@/lib/auth";
import { requireRole, requireTenant } from "@/lib/auth/guards";

import {
  getProduct,
  updateProduct,
  softDeleteProduct,
} from "@/lib/products/domain";

import { validateUpdateProduct } from "@/lib/products/validators";

import type { UpdateProductDTO } from "@/types/product";

import { handleRouteError } from "@/lib/http/handleRouteError";

export async function GET(
  _req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const rawUser = await getUserFromRequest();
    const actor = requireTenant(rawUser);
    requireRole(actor, "staff");

    const product = await getProduct(actor, params.productId);

    return NextResponse.json({ product });
  } catch (err: unknown) {
    return handleRouteError(err);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const rawUser = await getUserFromRequest();
    const actor = requireTenant(rawUser);
    requireRole(actor, "staff");

    const body: unknown = await req.json();
    validateUpdateProduct(body);

    const dto = body as UpdateProductDTO;

    const product = await updateProduct(actor, params.productId, dto);

    return NextResponse.json({ product });
  } catch (err: unknown) {
    return handleRouteError(err);
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const rawUser = await getUserFromRequest();
    const actor = requireTenant(rawUser);
    requireRole(actor, "staff");

    await softDeleteProduct(actor, params.productId);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return handleRouteError(err);
  }
}
