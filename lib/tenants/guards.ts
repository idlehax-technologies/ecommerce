import { Tenant } from "@/types/tenant";
import {
    TenantNotFoundError,
    TenantAlreadyActiveError,
    TenantCannotActivateError,
    TenantCannotSuspendError,
    TenantCannotArchiveError,
} from "./errors";

/**
 * Existence
 */
export function assertExists(t: Tenant | null): asserts t is Tenant {
    if (!t) throw new TenantNotFoundError();
}

/**
 * Lifecycle rules
 */
export function assertCanActivate(t: Tenant) {
    if (t.status === "ACTIVE") {
        throw new TenantAlreadyActiveError();
    }

    if (t.status === "ARCHIVED") {
        throw new TenantCannotActivateError(
            "Cannot activate archived tenant"
        );
    }
}

export function assertCanSuspend(t: Tenant) {
    if (t.status !== "ACTIVE") {
        throw new TenantCannotSuspendError(
            "Only ACTIVE tenants can be suspended"
        );
    }
}

export function assertCanArchive(t: Tenant) {
    if (t.status === "ARCHIVED") {
        throw new TenantCannotArchiveError();
    }
}