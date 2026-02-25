// app/api/admin/products/route.ts

import { NextResponse } from "next/server";

import { getUserFromRequest } from "@/lib/auth";
import { requireRole } from "@/lib/auth/guards";

import {
  listProductsForPlatform,
  createPlatformProduct,
} from "@/lib/products/service";

import { validateCreateProduct } from "@/lib/products/validators";
import type { CreateProductDTO } from "@/types/product";

import { handleRouteError } from "@/lib/http/handleRouteError";

export async function GET() {
  try {
    const rawUser = await getUserFromRequest();
    requireRole(rawUser, "superadmin");

    const products = await listProductsForPlatform();

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

    const product = await createPlatformProduct(dto);

    return NextResponse.json({ product }, { status: 201 });
  } catch (err: unknown) {
    return handleRouteError(err);
  }
}