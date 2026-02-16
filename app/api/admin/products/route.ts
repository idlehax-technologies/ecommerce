import { NextResponse } from "next/server";

import { getUserFromRequest } from "@/lib/auth";
import { requireRole, requireTenant } from "@/lib/auth/guards";

import { listProducts, createProduct } from "@/lib/products/domain";

import { validateCreateProduct } from "@/lib/products/validators";

import type { CreateProductDTO } from "@/types/product";

import { handleRouteError } from "@/lib/http/handleRouteError";

export async function GET() {
  try {
    const rawUser = await getUserFromRequest();
    const actor = requireTenant(rawUser);
    requireRole(actor, "staff");

    const products = await listProducts(actor);

    return NextResponse.json({ products });
  } catch (err: unknown) {
    return handleRouteError(err);
  }
}

export async function POST(req: Request) {
  try {
    const rawUser = await getUserFromRequest();
    const actor = requireTenant(rawUser);
    requireRole(actor, "staff");

    const body: unknown = await req.json();
    validateCreateProduct(body);

    const dto = body as CreateProductDTO;

    const product = await createProduct(actor, dto);

    return NextResponse.json({ product }, { status: 201 });
  } catch (err: unknown) {
    return handleRouteError(err);
  }
}
