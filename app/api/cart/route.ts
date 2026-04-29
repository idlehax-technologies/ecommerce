import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/auth/guards";
import { guardRequest } from "@/lib/security/requestGuard";
import * as cartDomain from "@/lib/cart/domain";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { assertAddToCartDTO } from "@/lib/cart/guards";

export async function GET(req: Request) {
    try {
        const user = await guardRequest(req, { requireAuth: true });
        const actor = requireTenant(user);

        const cart = cartDomain.getCart(actor);

        return NextResponse.json(cart);
    } catch (err) {
        return handleRouteError(err);
    }
}

export async function POST(req: Request) {
    try {
        const user = await guardRequest(req, {
            requireAuth: true,
            csrf: true,
        });

        const actor = requireTenant(user);

        const body: unknown = await req.json();

        assertAddToCartDTO(body);

        const cart = await cartDomain.addItem(actor, body);

        return NextResponse.json(cart);
    } catch (err) {
        return handleRouteError(err);
    }
}

export async function DELETE(req: Request) {
    try {
        const user = await guardRequest(req, {
            requireAuth: true,
            csrf: true,
        });

        const actor = requireTenant(user);

        cartDomain.clearCart(actor);

        return NextResponse.json({ ok: true });
    } catch (err) {
        return handleRouteError(err);
    }
}