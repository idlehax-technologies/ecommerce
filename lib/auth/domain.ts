import type { OtpRequestDto, OtpVerifyDto } from "@/types/otp";
import type { AuthUser } from "@/types/auth";

import { authStore, otpStoreApi } from "./storage";
import { InvalidOtpError, OtpRateLimitError } from "./errors";
import { signToken } from "@/lib/jwt";

const EXPIRY_MS = 2 * 60 * 1000;
const RESEND_COOLDOWN = 30 * 1000;
const MAX_ATTEMPTS = 5;

const randomCode = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

/* ---------------- OTP DOMAIN ---------------- */

function sendOtp(phone: string) {
    const existing = otpStoreApi.get(phone);

    if (existing && Date.now() - existing.lastRequestedAt < RESEND_COOLDOWN) {
        throw new OtpRateLimitError();
    }

    const code = "123456";

    otpStoreApi.save({
        phone,
        code,
        expiresAt: Date.now() + EXPIRY_MS,
        attempts: 0,
        lastRequestedAt: Date.now(),
    });

    console.log(`OTP for ${phone}: ${code}`);
}

function verifyOtpCode(phone: string, code: string) {
    const rec = otpStoreApi.get(phone);
    if (!rec) throw new InvalidOtpError();

    if (rec.expiresAt < Date.now()) {
        otpStoreApi.delete(phone);
        throw new InvalidOtpError();
    }

    if (rec.attempts >= MAX_ATTEMPTS) {
        otpStoreApi.delete(phone);
        throw new InvalidOtpError();
    }

    if (rec.code !== code) {
        rec.attempts++;
        otpStoreApi.save(rec);
        throw new InvalidOtpError();
    }

    otpStoreApi.delete(phone);
}

/* ---------------- PUBLIC DOMAIN API ---------------- */

export async function requestOtp(input: OtpRequestDto) {
    sendOtp(input.phone);
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
        };
        authStore.save(user);
    }

    const token = signToken({
        userId: user.userId,
        phone: user.phone,
        activeMembershipId: user.activeMembershipId,
        isSuperadmin: user.isSuperadmin,
        impersonatedBy: user.impersonatedBy,
    });

    return { user, token };
}