import type { OtpRequestDto, OtpVerifyDto } from "@/types/otp";
import type { AuthUser } from "@/types/auth";

import { sendOtp, verifyOtp as verifyOtpCode } from "./otpService";
import { authStore } from "./storage";
import { signToken } from "@/lib/jwt";

export async function requestOtp(input: OtpRequestDto) {
    await sendOtp(input.phone);
}

export async function verifyOtp(
    input: OtpVerifyDto
): Promise<{ user: AuthUser; token: string }> {
    verifyOtpCode(input.phone, input.code);

    let user = authStore.findByPhone(input.phone);

    if (!user) {
        user = {
            userId: crypto.randomUUID(),
            phone: input.phone,
            role: "customer",
            tenantId: undefined,
            impersonatedBy: undefined,
        };
        authStore.save(user);
    }

    const token = signToken({
        userId: user.userId,
        phone: user.phone,
        role: user.role,
        tenantId: user.tenantId ?? undefined,
        impersonatedBy: user.impersonatedBy ?? undefined,
    });

    return { user, token };
}