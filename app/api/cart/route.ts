import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/auth/guards";
import { guardRequest } from "@/lib/security/requestGuard";
import * as cartDomain from "@/lib/cart/domain";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { assertAddToCartDTO } from "@/lib/cart/guards";
import { recordLatency, recordRequest, recordUser } from "@/lib/metrics";

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
    const start = Date.now();
    recordRequest();

    try {
        const user = await guardRequest(req, {
            requireAuth: true,
            csrf: true,
        });

        const actor = requireTenant(user);
        recordUser(actor.userId);

        const body: unknown = await req.json();

        assertAddToCartDTO(body);

        const cart = await cartDomain.addItem(actor, body);

        recordLatency(Date.now() - start);

        return NextResponse.json(cart);
    } catch (err) {
        recordLatency(Date.now() - start);
        return handleRouteError(err);
    }
}

export async function DELETE(req: Request) {
    const start = Date.now();
    recordRequest();

    try {
        const user = await guardRequest(req, {
            requireAuth: true,
            csrf: true,
        });

        const actor = requireTenant(user);
        recordUser(actor.userId);

        cartDomain.clearCart(actor);

        recordLatency(Date.now() - start);

        return NextResponse.json({ ok: true });
    } catch (err) {
        recordLatency(Date.now() - start);
        return handleRouteError(err);
    }
}