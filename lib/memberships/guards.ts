import type { Membership } from "@/types/membership";
import {
    MembershipNotFoundError,
    MembershipInvalidStateError,
} from "./errors";

export function assertExists(m: Membership | null): asserts m is Membership {
    if (!m) throw new MembershipNotFoundError();
}

export function assertPending(m: Membership) {
    if (m.status !== "pending") throw new MembershipInvalidStateError();
}
