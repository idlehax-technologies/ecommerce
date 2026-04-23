import { expirePendingMemberships } from "@/lib/memberships/domain";

export function runMembershipExpiryJob() {
    expirePendingMemberships();
}