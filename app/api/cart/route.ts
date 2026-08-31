import { NextResponse } from "next/server";

import { requireMembershipRole, requireMembership } from "@/lib/auth/guards";
import { guardRequest } from "@/lib/security/requestGuard";

import * as cartDomain from "@/lib/cart/domain";
import { getCartView } from "@/lib/cart/service";
import { assertAddToCartDTO } from "@/lib/cart/guards";

import { handleRouteError } from "@/lib/http/handleRouteError";

import {
    recordLatency,
    recordRequest,
    recordUser,
} from "@/lib/metrics";

export async function GET(req: Request) {
    try {

        const user = await guardRequest(req, {
            requireAuth: true,
        });

        await requireMembershipRole(user, ["customer"]);

        const actor = await requireMembership(user);

        const cart = await cartDomain.getUserCart(
            actor.tenantId,
            actor.userId
        );

        const view = await getCartView(cart);

        return NextResponse.json({
            cart: view,
        });

    } catch (err: unknown) {
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

        await requireMembershipRole(user, ["customer"]);

        const actor = await requireMembership(user);

        recordUser(actor.userId);

        const body: unknown = await req.json();

        assertAddToCartDTO(body);

        const cart = await cartDomain.addItem(
            actor.tenantId,
            actor.userId,
            body
        );

        const view = await getCartView(cart);

        recordLatency(Date.now() - start);

        return NextResponse.json({
            cart: view,
        });

    } catch (err: unknown) {

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

        await requireMembershipRole(user, ["customer"]);

        const actor = await requireMembership(user);

        recordUser(actor.userId);

        await cartDomain.clearCart(
            actor.tenantId,
            actor.userId
        );

        recordLatency(Date.now() - start);

        return NextResponse.json({
            success: true,
        });

    } catch (err: unknown) {

        recordLatency(Date.now() - start);

        return handleRouteError(err);
    }
}