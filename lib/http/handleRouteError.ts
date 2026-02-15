import { NextResponse } from "next/server";

import { AuthDomainError } from "@/lib/auth/errors";
import { TenantDomainError } from "@/lib/tenants/errors";
import { ProductDomainError } from "@/lib/products/errors";
import { MembershipDomainError } from "@/lib/memberships/errors";
import { CheckoutDomainError } from "@/lib/checkout/errors";

/**
 * Central HTTP error translator.
 *
 * Routes call this in catch blocks to convert domain/auth failures
 * into consistent API responses.
 */
export function handleRouteError(err: unknown) {
    // Known domain / auth errors (carry their own HTTP status)
    if (
        err instanceof AuthDomainError ||
        err instanceof TenantDomainError ||
        err instanceof ProductDomainError ||
        err instanceof MembershipDomainError
    ) {
        return NextResponse.json(
            { error: err.message },
            { status: err.status }
        );
    }

    if (err instanceof CheckoutDomainError) {
        return NextResponse.json(
            {
                success: false,
                errorCode: err.code,
                message: err.message,
            },
            { status: err.status }
        );
    }

    // Unexpected error — do not leak internals
    console.error("Unhandled route error:", err);

    return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
    );
}
