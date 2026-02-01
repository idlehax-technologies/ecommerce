import { NextResponse } from "next/server";

import { getVendorFromRequest } from "@/lib/auth";

import {
  createProduct,
  getVendorProducts,
} from "@/lib/products";

import {
  validateCreateProduct,
} from "@/lib/validators/product";

import {
  toCreateProductInput,
} from "@/lib/mappers/product";

import {
  ProductDomainError,
  InvalidProductInputError,
} from "@/lib/errors/productErrors";


/* =====================================================
   POST /api/vendor/products
   Create product
   ===================================================== */

export async function POST(req: Request) {
  try {
    // 1. auth
    const { vendorId } = await getVendorFromRequest();

    // 2. parse
    const body = await req.json();

    // 3. validate (unknown → DTO)
    validateCreateProduct(body);

    // 4. map (DTO → domain input)
    const input = toCreateProductInput(body, vendorId);

    // 5. domain
    const product = await createProduct(input);

    return NextResponse.json({ product }, { status: 201 });

  } catch (e: unknown) {
    /* ----------------------------
       Typed error translation
       ---------------------------- */

    if (e instanceof InvalidProductInputError) {
      return NextResponse.json(
        { error: e.message },
        { status: 400 }
      );
    }

    if (e instanceof ProductDomainError) {
      return NextResponse.json(
        { error: e.message },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}


/* =====================================================
   GET /api/vendor/products
   List vendor products
   ===================================================== */

export async function GET(req: Request) {
  try {
    // 1. auth
    const { vendorId } = await getVendorFromRequest();

    // 2. query params
    const { searchParams } = new URL(req.url);

    const includeDeleted =
      searchParams.get("includeDeleted") === "true";

    // 3. domain
    const products = await getVendorProducts(
      vendorId,
      includeDeleted
    );

    return NextResponse.json({ products }, { status: 200 });

  } catch (e: unknown) {
    if (e instanceof ProductDomainError) {
      return NextResponse.json(
        { error: e.message },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
