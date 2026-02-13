import type { RequestMembershipDTO } from "@/types/membership";
import { MembershipValidationError } from "./errors";

export function assertRequestMembershipDTO(
    body: unknown
): asserts body is RequestMembershipDTO {
    if (!body || typeof body !== "object") {
        throw new MembershipValidationError();
    }

    const obj = body as Record<string, unknown>;

    if (typeof obj.tenantId !== "string") {
        throw new MembershipValidationError();
    }
}

