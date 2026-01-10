export type UserRole = "customer" | "vendor";

export type User = {
    id: string;
    name: string;
    role: UserRole;
};
