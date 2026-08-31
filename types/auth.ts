import { MembershipRole } from "./membership";

export type UserIdentity = {
  userId: string;
  phone: string;
  isSuperadmin: boolean;
};

export type SessionPayload = {
  activeMembershipId?: string;
  impersonatedBy?: string;
};

export type AuthUser = UserIdentity & SessionPayload;

export type AuthState = {
  user: AuthUser | null;
  loading: boolean;
};

export type MembershipActor = {
  userId: string;
  tenantId: string;
  role: MembershipRole;
};