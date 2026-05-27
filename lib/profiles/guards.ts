import { ProfileDTO } from "@/types/profile";
import { ProfileIncompleteError } from "./errors";

export function assertCompleteProfile(input: ProfileDTO): void {
    if (!input.fullName || !input.email || !input.addressText) {
        throw new ProfileIncompleteError();
    }
}