import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/auth/guards";
import { guardRequest } from "@/lib/security/requestGuard";
import * as cartDomain from "@/lib/cart/domain";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { assertUpdateCartItemDTO } from "@/lib/cart/guards";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ productId: string }> }
) {
    try {
        const { productId } = await params;

        const user = await guardRequest(req, {
            requireAuth: true,
            csrf: true,
        });

        const actor = requireTenant(user);

        const body: unknown = await req.json();

        assertUpdateCartItemDTO(body);

        const cart = cartDomain.updateItem(actor, productId, body);

        return NextResponse.json(cart);
    } catch (err) {
        return handleRouteError(err);
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ productId: string }> }
) {
    try {
        const { productId } = await params;

        const user = await guardRequest(req, {
            requireAuth: true,
            csrf: true,
        });

        const actor = requireTenant(user);

        const cart = cartDomain.removeItem(actor, productId);

        return NextResponse.json(cart);
    } catch (err) {
        return handleRouteError(err);
    }
}