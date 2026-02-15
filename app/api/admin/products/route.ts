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

import type { CreateProductInput } from "@/types/product";
import { requireRole } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";


// ============================================
// GET /api/admin/products
// List tenant products
// ============================================
export async function GET() {
  try {
    const rawUser = await getUserFromRequest();
    const user = requireRole(rawUser, "staff");

    const products = await getTenantProducts(user.tenantId!);

    return NextResponse.json({ products });
  } catch (err: unknown) {
    return handleRouteError(err);
  }
}


// ============================================
// POST /api/admin/products
// Create product
// ============================================
export async function POST(req: Request) {
  try {
    const rawUser = await getUserFromRequest();
    const user = requireRole(rawUser, "staff");

    const body: unknown = await req.json();

    // shape validation
    validateCreateProduct(body);

    const dto = body as CreateProductInput;

    // DTO → domain input
    const input = toCreateProductInput(dto, user.tenantId!);

    const product = await createProduct(input);

    return NextResponse.json({ product }, { status: 201 });
  } catch (err: unknown) {
    return handleRouteError(err);
  }
}
