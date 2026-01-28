import { UserRole } from "./auth";

export type User = {
    userId: string;
    name: string;
    email: string;
    role: UserRole;
};

export type Vendor = User & {
    role: "vendor";
    shopName: string;
};
