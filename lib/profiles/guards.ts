import { UpsertProfileInput } from "@/types/profile";
import { ProfileIncompleteError } from "./errors";

export function assertCompleteProfile(input: UpsertProfileInput) {
    if (!input.fullName || !input.email || !input.addressText) {
        throw new ProfileIncompleteError();
    }
}