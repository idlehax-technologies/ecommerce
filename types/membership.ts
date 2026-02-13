export type MembershipStatus =
    | "pending"
    | "approved"
    | "rejected";

export type Membership = {
    membershipId: string;
    userId: string;
    tenantId: string;
    status: MembershipStatus;
    createdAt: string;
    updatedAt: string;
};

export type PublicMembership = Omit<Membership, "userId">;

export type RequestMembershipDTO = {
    tenantId: string;
};

export type ApproveMembershipDTO = {
    membershipId: string;
};

export type RejectMembershipDTO = {
    membershipId: string;
};
