import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/auth/guards";
import { getUserFromRequest } from "@/lib/auth";
import * as cartDomain from "@/lib/cart/domain";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { assertAddToCartDTO } from "@/lib/cart/guards";

export async function GET() {
    try {
        const rawUser = await getUserFromRequest();
        const actor = requireTenant(rawUser);

        const cart = cartDomain.getCart(actor);

        return NextResponse.json(cart);
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}

export async function POST(req: Request) {
    try {
        const rawUser = await getUserFromRequest();
        const actor = requireTenant(rawUser);

        const body: unknown = await req.json();

        assertAddToCartDTO(body);

        const cart = await cartDomain.addItem(actor, body);

        return NextResponse.json(cart);
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}

export async function DELETE() {
    try {
        const rawUser = await getUserFromRequest();
        const actor = requireTenant(rawUser);

        cartDomain.clearCart(actor);

        return NextResponse.json({ ok: true });
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}
