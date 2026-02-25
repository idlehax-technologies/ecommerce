// app/api/admin/products/route.ts

import { NextResponse } from "next/server";

import { getUserFromRequest } from "@/lib/auth";
import { requireRole } from "@/lib/auth/guards";

import { listProducts, createProduct } from "@/lib/products/domain";
import { validateCreateProduct } from "@/lib/products/validators";

import type { CreateProductDTO } from "@/types/product";

import { handleRouteError } from "@/lib/http/handleRouteError";

/**
 * Admin Catalog Surface (Platform-Owned)
 *
 * Products are no longer tenant-scoped.
 * Only privileged operators (staff/admin/superadmin) manage catalog.
 */

export async function GET() {
  try {
    const rawUser = await getUserFromRequest();
    requireRole(rawUser, "superadmin");

    const products = await listProducts();

    return NextResponse.json({ products });
  } catch (err: unknown) {
    return handleRouteError(err);
  }
}

export async function POST(req: Request) {
  try {
    const rawUser = await getUserFromRequest();
    requireRole(rawUser, "superadmin");

    const body: unknown = await req.json();
    validateCreateProduct(body);

    const dto = body as CreateProductDTO;

    const product = await createProduct(dto);

    return NextResponse.json({ product }, { status: 201 });
  } catch (err: unknown) {
    return handleRouteError(err);
  }
}