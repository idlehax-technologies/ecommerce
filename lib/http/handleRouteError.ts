import { NextResponse } from "next/server";

import { AuthDomainError } from "@/lib/auth/errors";
import { TenantDomainError } from "@/lib/tenants/errors";
import { ProductDomainError } from "@/lib/products/errors";
import { MembershipDomainError } from "@/lib/memberships/errors";
import { CheckoutDomainError } from "@/lib/checkout/errors";
import { CartDomainError } from "@/lib/cart/errors";
import { OrderDomainError } from "../orders/errors";
import { PaymentDomainError } from "../payments/errors";
import { TenantInventoryDomainError } from "../tenantInventory/errors";
import { recordError } from "../metrics";
import { JobDomainError } from "../jobs/errors";
import { ReconciliationDomainError } from "../reconciliation/errors";
import { ExportDomainError } from "../export/errors";

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
        err instanceof MembershipDomainError ||
        err instanceof CheckoutDomainError ||
        err instanceof CartDomainError ||
        err instanceof OrderDomainError ||
        err instanceof PaymentDomainError ||
        err instanceof TenantInventoryDomainError ||
        err instanceof JobDomainError ||
        err instanceof ReconciliationDomainError ||
        err instanceof ExportDomainError
    ) {
        return NextResponse.json(
            { error: err.message },
            { status: err.status }
        );
    }

    // Unexpected error — do not leak internals
    console.error("Unhandled route error:", err);

    recordError(); // implicit: type = "internal"

    return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
    );
}
