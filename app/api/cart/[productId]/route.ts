import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/auth/guards";
import { getUserFromRequest } from "@/lib/auth";
import * as cartDomain from "@/lib/cart/domain";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { assertUpdateCartItemDTO } from "@/lib/cart/guards";

export async function PATCH(
    req: Request,
    { params }: { params: { productId: string } }
) {
    try {
        const rawUser = await getUserFromRequest();
        const actor = requireTenant(rawUser);

        const body: unknown = await req.json();

        assertUpdateCartItemDTO(body);

        const cart = cartDomain.updateItem(actor, params.productId, body);

        return NextResponse.json(cart);
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}

export async function DELETE(
    _req: Request,
    { params }: { params: { productId: string } }
) {
    try {
        const rawUser = await getUserFromRequest();
        const actor = requireTenant(rawUser);

        const cart = cartDomain.removeItem(actor, params.productId);

        return NextResponse.json(cart);
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}
