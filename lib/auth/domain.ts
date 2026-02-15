import { OtpRequestDto, OtpVerifyDto } from "@/types/otp";
import { sendOtp, verifyOtp as check } from "./otpService";
import { findUserByPhone, createUser } from "./storage";
import { signToken } from "@/lib/jwt";

export async function requestOtp(input: OtpRequestDto) {
    await sendOtp(input.phone);
}

export async function verifyOtp(input: OtpVerifyDto) {
    check(input.phone, input.code);

    let user = findUserByPhone(input.phone);
    if (!user) user = createUser(input.phone);

    const token = signToken({
        userId: user.userId,
        phone: user.phone,
        role: user.role,
        tenantId: user.tenantId ?? undefined,
    });

    return { user, token };
}
