import { NextResponse } from "next/server";

import { getVendorFromRequest } from "@/lib/auth";

import {
  getProductById,
  updateProduct,
  softDeleteProduct,
} from "@/lib/products";

import {
  validateUpdateProduct,
} from "@/lib/validators/product";

import {
  toUpdateProductPatch,
} from "@/lib/mappers/product";

import {
  ProductDomainError,
  InvalidProductInputError,
  ProductNotFoundError,
} from "@/lib/errors/productErrors";


/* =====================================================
   GET /api/vendor/products/[productId]
   ===================================================== */

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { vendorId } = await getVendorFromRequest();
    const { productId } = await params;

    const product = await getProductById(productId, vendorId);

    return NextResponse.json({ product }, { status: 200 });

  } catch (e: unknown) {
    if (e instanceof ProductNotFoundError) {
      return NextResponse.json({ error: e.message }, { status: 404 });
    }

    if (e instanceof ProductDomainError) {
      return NextResponse.json({ error: e.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}


/* =====================================================
   PATCH /api/vendor/products/[productId]
   ===================================================== */

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { vendorId } = await getVendorFromRequest();
    const { productId } = await params;

    const body = await req.json();

    // validate (unknown → DTO)
    validateUpdateProduct(body);

    // map (DTO → domain patch)
    const patch = toUpdateProductPatch(body);

    const updated = await updateProduct(
      productId,
      vendorId,
      patch
    );

    return NextResponse.json(
      { product: updated },
      { status: 200 }
    );

  } catch (e: unknown) {
    if (e instanceof InvalidProductInputError) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }

    if (e instanceof ProductNotFoundError) {
      return NextResponse.json({ error: e.message }, { status: 404 });
    }

    if (e instanceof ProductDomainError) {
      return NextResponse.json({ error: e.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}


/* =====================================================
   DELETE /api/vendor/products/[productId]
   ===================================================== */

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { vendorId } = await getVendorFromRequest();
    const { productId } = await params;

    await softDeleteProduct(productId, vendorId);

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );

  } catch (e: unknown) {
    if (e instanceof ProductNotFoundError) {
      return NextResponse.json({ error: e.message }, { status: 404 });
    }

    if (e instanceof ProductDomainError) {
      return NextResponse.json({ error: e.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
