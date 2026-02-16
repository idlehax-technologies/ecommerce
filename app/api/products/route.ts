import { NextResponse } from "next/server";

import { listPublicProducts } from "@/lib/products/domain";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { getUserFromRequest } from "@/lib/auth";
import { requireAuth, requireTenant } from "@/lib/auth/guards";

export async function GET() {
  try {
    const rawUser = await getUserFromRequest();
    const actor = requireTenant(rawUser);

    const products = await listPublicProducts(actor);

    return NextResponse.json({ products });
  } catch (err: unknown) {
    return handleRouteError(err);
  }
}
