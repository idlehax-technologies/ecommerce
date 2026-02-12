import type { UserRole } from "./auth";

export type SessionPayload = {
    userId: string;
    phone: string;
    role: UserRole;
    tenantId?: string;
    impersonatedBy?: string;
};
