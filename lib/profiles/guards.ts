import { UpsertProfileInput } from "@/types/profile";

export function assertCompleteProfile(input: UpsertProfileInput) {
    if (!input.fullName || !input.email || !input.addressText) {
        throw new Error("All profile fields are required");
    }
}