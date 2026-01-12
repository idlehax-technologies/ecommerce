export type Role = "CUSTOMER" | "VENDOR";

export type User = {
    userId: string;
    name: string;
    email: string;
    role: Role;
};

export type Vendor = User & {
    role: "VENDOR";
    shopName: string;
};
