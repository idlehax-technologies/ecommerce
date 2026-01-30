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

/**
 * GET /api/vendor/products/[productId]
 * Fetch a single product owned by the vendor
 */
export async function GET(
  _req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const { vendorId } = await getVendorFromRequest();
    const { productId } = params;

    const product = await getProductById(productId, vendorId);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Unauthorized" },
      { status: 401 }
    );
  }
}

/**
 * PATCH /api/vendor/products/[productId]
 * Update mutable fields of a vendor product
 */
export async function PATCH(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const { vendorId } = await getVendorFromRequest();
    const { productId } = params;

    const body = await req.json();
    validateUpdateProduct(body);

    const updated = await updateProduct(
      productId,
      vendorId,
      body
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { product: updated },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Unauthorized" },
      { status: 401 }
    );
  }
}

/**
 * DELETE /api/vendor/products/[productId]
 * Soft-delete a vendor product
 */
export async function DELETE(
  _req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const { vendorId } = await getVendorFromRequest();
    const { productId } = params;

    const deleted = await softDeleteProduct(
      productId,
      vendorId
    );

    if (!deleted) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Unauthorized" },
      { status: 401 }
    );
  }
}
