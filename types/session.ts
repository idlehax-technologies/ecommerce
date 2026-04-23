export type SessionPayload = {
    userId: string;
    phone: string;
    activeMembershipId?: string;
    isSuperadmin?: boolean;   // ✅ ADD THIS
    impersonatedBy?: string;
};