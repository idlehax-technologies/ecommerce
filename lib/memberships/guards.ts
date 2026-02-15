import type { Membership } from "@/types/membership";
import {
    MembershipNotFoundError,
    MembershipInvalidStateError,
    MembershipAlreadyActiveError,
} from "./errors";

export function assertExists(m: Membership | null): asserts m is Membership {
    if (!m) throw new MembershipNotFoundError();
}

export function assertDoesNotExist(m: Membership | null | undefined): asserts m is null | undefined {
    if (m) throw new MembershipAlreadyActiveError();
}

export function assertPending(m: Membership) {
    if (m.status !== "pending") throw new MembershipInvalidStateError();
}
