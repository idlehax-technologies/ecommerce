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

import { ProductDomainError } from "@/lib/products/errors";

import type { UpdateProductPatch } from "@/types/product";


// ============================================
// GET /api/admin/products/:productId
// ============================================
export async function GET(
  _req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const user = await getUserFromRequest();

    if (!user || (user.role !== "admin" && user.role !== "staff")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const product = await getProductById(
      params.productId,
      user.tenantId!
    );

    return NextResponse.json({ product });
  } catch (e) {
    if (e instanceof ProductDomainError) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }

    console.error(e);

    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
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
    const user = await getUserFromRequest();

    if (!user || (user.role !== "admin" && user.role !== "staff")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
  } catch (e) {
    if (e instanceof ProductDomainError) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }

    console.error(e);

    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
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
    const user = await getUserFromRequest();

    if (!user || (user.role !== "admin" && user.role !== "staff")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await softDeleteProduct(params.productId, user.tenantId!);

    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof ProductDomainError) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }

    console.error(e);

    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
