import { NextResponse } from "next/server";
import { getVendorFromRequest } from "@/lib/auth";
import {
  createProduct,
  getVendorProducts,
} from "@/lib/products";
import {
  validateCreateProduct,
} from "@/lib/validators/product";

// --------------------
// POST /api/vendor/products
// Create product
// --------------------
export async function POST(req: Request) {
  try {
    const { vendorId } = await getVendorFromRequest();

    const body = await req.json();
    validateCreateProduct(body);

    const product = await createProduct({
      vendorId, // injected, never from body
      title: body.title,
      description: body.description,
      price: body.price,
      stock: body.stock,
      sku: body.sku,
      images: body.images,
      category: body.category,
      tags: body.tags,
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Failed to create product" },
      { status: 400 }
    );
  }
}

// --------------------
// GET /api/vendor/products
// List vendor products
// --------------------
export async function GET(req: Request) {
  try {
    const { vendorId } = await getVendorFromRequest();

    const { searchParams } = new URL(req.url);
    const includeDeleted =
      searchParams.get("includeDeleted") === "true";

    const products = await getVendorProducts(
      vendorId,
      includeDeleted
    );

    return NextResponse.json({ products }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Failed to fetch products" },
      { status: 500 }
    );
  }
}
