import { NextResponse } from "next/server";

import { getUserFromRequest } from "@/lib/auth";

import {
  getTenantProducts,
  createProduct,
} from "@/lib/products/domain";

import {
  validateCreateProduct,
} from "@/lib/products/validators";

import {
  toCreateProductInput,
} from "@/lib/products/mappers";

import { ProductDomainError } from "@/lib/products/errors";

import type { CreateProductInput } from "@/types/product";


// ============================================
// GET /api/admin/products
// List tenant products
// ============================================
export async function GET() {
  try {
    const user = await getUserFromRequest();

    if (!user || (user.role !== "admin" && user.role !== "staff")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await getTenantProducts(user.tenantId!);

    return NextResponse.json({ products });
  } catch (e) {
    console.error(e);

    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}


// ============================================
// POST /api/admin/products
// Create product
// ============================================
export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest();

    if (!user || (user.role !== "admin" && user.role !== "staff")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: unknown = await req.json();

    // shape validation
    validateCreateProduct(body);

    const dto = body as CreateProductInput;

    // DTO → domain input
    const input = toCreateProductInput(dto, user.tenantId!);

    const product = await createProduct(input);

    return NextResponse.json({ product }, { status: 201 });
  } catch (e) {
    if (e instanceof ProductDomainError) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }

    console.error(e);

    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
