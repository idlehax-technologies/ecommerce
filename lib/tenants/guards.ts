import { Tenant } from "@/types/tenant";
import {
    TenantAlreadyActiveError,
    TenantAlreadyInactiveError,
    TenantNotFoundError,
    TenantPermissionError,
} from "./errors";

export function assertExists(t: Tenant | null): asserts t is Tenant {
    if (!t) throw new TenantNotFoundError("Tenant not found");
}

export function assertCanActivate(t: Tenant) {
    if (t.status === "active") {
        throw new TenantAlreadyActiveError("Already active");
    }
}

export function assertCanDeactivate(t: Tenant) {
    if (t.status === "inactive") {
        throw new TenantAlreadyInactiveError("Already inactive");
    }
}

export function assertSuperadmin(role?: string) {
    if (role !== "superadmin") {
        throw new TenantPermissionError("Superadmin only");
    }
}
