import { NextResponse } from "next/server";

import { requireTenant } from "@/lib/auth/guards";
import { guardRequest } from "@/lib/security/requestGuard";

import * as cartDomain from "@/lib/cart/domain";

import { handleRouteError } from "@/lib/http/handleRouteError";

import { assertUpdateCartItemDTO } from "@/lib/cart/guards";

import {
    recordLatency,
    recordRequest,
    recordUser,
} from "@/lib/metrics";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ productId: string }> }
) {

    const start = Date.now();

    recordRequest();

    try {

        const { productId } = await params;

        const user = await guardRequest(req, {
            requireAuth: true,
            csrf: true,
        });

        const actor = requireTenant(user);

        recordUser(actor.userId);

        const body: unknown = await req.json();

        assertUpdateCartItemDTO(body);

        const cart = await cartDomain.updateItem(
            actor.tenantId,
            actor.userId,
            productId,
            body
        );

        recordLatency(Date.now() - start);

        return NextResponse.json({ cart });

    } catch (err: unknown) {

        recordLatency(Date.now() - start);

        return handleRouteError(err);
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ productId: string }> }
) {

    const start = Date.now();

    recordRequest();

    try {

        const { productId } = await params;

        const user = await guardRequest(req, {
            requireAuth: true,
            csrf: true,
        });

        const actor = requireTenant(user);

        recordUser(actor.userId);

        const cart = cartDomain.removeItem(
            actor.tenantId,
            actor.userId,
            productId
        );

        recordLatency(Date.now() - start);

        return NextResponse.json({ cart });

    } catch (err: unknown) {

        recordLatency(Date.now() - start);

        return handleRouteError(err);
    }
}