import { MembershipRole } from "./membership";

export type AuthUser = {
  userId: string;
  phone: string;
  activeMembershipId?: string;
  isSuperadmin?: boolean;
  impersonatedBy?: string;
};

export type AuthState = {
  user: AuthUser | null;
  loading: boolean;
};

export type MembershipActor = {
  userId: string;
  tenantId: string;
  role: MembershipRole;
};

export type TenantActor = {
  type: "tenant";
  membership: {
    userId: string;
    tenantId: string;
    role: MembershipRole;
  };
};

export type SuperadminActor = {
  type: "superadmin";
  userId: string;
};

export type AccessActor = TenantActor | SuperadminActor;