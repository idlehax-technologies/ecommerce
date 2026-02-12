import { sendOtp, verifyOtp as check } from "./otpService";
import { findUserByPhone, createUser } from "./storage";
import { signToken } from "@/lib/jwt";

export async function requestOtp(phone: string) {
    await sendOtp(phone);
}

export async function verifyOtp(phone: string, code: string) {
    check(phone, code);

    let user = findUserByPhone(phone);
    if (!user) user = createUser(phone);

    const token = signToken({
        userId: user.userId,
        phone: user.phone,
        role: user.role,
        tenantId: user.tenantId ?? undefined,
    });

    return { user, token };
}
