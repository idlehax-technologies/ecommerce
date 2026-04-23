export type MembershipStatus =
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "REVOKED"
    | "EXPIRED"; // ✅ NEW

export type MembershipRole = "customer" | "staff" | "admin";

export type Membership = {
    membershipId: string;
    userId: string;
    tenantId: string;
    role: MembershipRole;
    status: MembershipStatus;
    createdAt: string;
    updatedAt: string;
};

export type RequestMembershipInput = {
    tenantId: string;
};

export type SelectMembershipInput = {
    membershipId: string;
};

export type UpdateMembershipRoleInput = {
    role: MembershipRole;
};

export type MembershipView = {
    membershipId: string;
    status: MembershipStatus;
    role: MembershipRole;
    createdAt: string,
    updatedAt: string,
    tenant: { tenantId: string; name: string };
    user: {
        userId: string;
        fullName: string;
        phone: string;
        email: string;
        addressText: string;
    };
};