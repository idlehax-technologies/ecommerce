import { Tenant } from "@/types/tenant";
import {
    TenantAlreadyActiveError,
    TenantAlreadyExistsError,
    TenantAlreadyInactiveError,
    TenantNotFoundError,
    TenantScopeError,
} from "./errors";
import { AuthUser, UserRole } from "@/types/auth";
import { requireAuth, requireTenant } from "../auth/guards";

export function assertExists(t: Tenant | null): asserts t is Tenant {
    if (!t) throw new TenantNotFoundError("Tenant not found");
}

export function assertDoesNotExist(t: Tenant | null): asserts t is null {
    if (t) throw new TenantAlreadyExistsError("Tenant already exists");
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

export function assertTenantScope(
    user: AuthUser & { tenantId: string },
    tenantId: string
): void {
    if (user.tenantId !== tenantId) {
        throw new TenantScopeError("Cross-tenant access denied");
    }
}
