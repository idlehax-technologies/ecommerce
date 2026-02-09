import { CreateTenantDTO } from "@/types/tenant";
import { TenantInvalidInputError } from "./errors";

export function assertCreateTenantDTO(body: unknown): asserts body is CreateTenantDTO {
    if (!body || typeof body !== "object") {
        throw new TenantInvalidInputError("Invalid body");
    }

    const { name } = body as any;

    if (typeof name !== "string" || name.trim().length === 0) {
        throw new TenantInvalidInputError("Name required");
    }
}
