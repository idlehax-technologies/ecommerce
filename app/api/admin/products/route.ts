// app/api/admin/products/route.ts

import { NextResponse } from "next/server";

import { getUserFromRequest } from "@/lib/auth";
import { requireSuperadmin } from "@/lib/auth/guards";

import {
  listProductsForPlatform,
  createPlatformProduct,
} from "@/lib/products/service";

import { validateCreateProduct } from "@/lib/products/validators";
import type { CreateProductDTO } from "@/types/product";

import { handleRouteError } from "@/lib/http/handleRouteError";
import { guardRequest } from "@/lib/security/requestGuard";

export async function GET(req: Request) {
  try {
    const user = await guardRequest(req, { requireAuth: true });
    requireSuperadmin(user);

    const products = await listProductsForPlatform();

    return NextResponse.json({ products });
  } catch (err: unknown) {
    return handleRouteError(err);
  }
}

export async function POST(req: Request) {
  try {
    const user = await guardRequest(req, {
      requireAuth: true,
      csrf: true,
    });
    requireSuperadmin(user);

    const body: unknown = await req.json();
    validateCreateProduct(body);

    const dto = body as CreateProductDTO;

    const product = await createPlatformProduct(dto);

    return NextResponse.json({ product }, { status: 201 });
  } catch (err: unknown) {
    return handleRouteError(err);
  }
}