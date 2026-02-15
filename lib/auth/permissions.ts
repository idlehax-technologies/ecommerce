import type { UserRole } from "@/types/auth";

export const canManageProducts = (role: UserRole) =>
    role === "staff";

export const canManageMemberships = (role: UserRole) =>
    role === "staff";

export const canManageStaff = (role: UserRole) =>
    role === "admin";

export const canManageTenants = (role: UserRole) =>
    role === "superadmin";
