import { UserRole } from "./auth";

export type User = {
    userId: string;
    name: string;
    email: string;
    role: UserRole;

    // NEW — school / tenant binding
    tenantId: string | null
};
