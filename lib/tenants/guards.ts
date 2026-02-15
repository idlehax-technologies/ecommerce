import { Tenant } from "@/types/tenant";
import {
    TenantAlreadyActiveError,
    TenantAlreadyExistsError,
    TenantAlreadyInactiveError,
    TenantNotFoundError,
} from "./errors";

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

// export function assertSuperadmin(role?: string) {
//     if (role !== "superadmin") {
//         throw new TenantPermissionError("Superadmin only");
//     }
// }
