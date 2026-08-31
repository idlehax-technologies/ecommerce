import { randomInt } from "crypto";

import type { AuthUser } from "@/types/auth";
import type { OtpRequestDto, OtpVerifyDto } from "@/types/otp";

import { OtpRateLimitError, InvalidOtpError } from "./errors";
import { authStore } from "./storage";

import {
    getOtp,
    saveOtp,
    verifyOtp as verifyOtpRedis,
} from "@/lib/redis/otp";
import { sendOtp } from "@/lib/otp/adapters";
import { signToken } from "@/lib/session/jwt";

const RESEND_COOLDOWN_MS = 30 * 1000;

// production OTP generation
const randomCode = () =>
    randomInt(100000, 1000000).toString();

/* ---------------- OTP DOMAIN ---------------- */

async function requestOtpCode(phone: string) {
    const existing = await getOtp(phone);

    if (
        existing &&
        Date.now() - existing.lastRequestedAt < RESEND_COOLDOWN_MS
    ) {
        throw new OtpRateLimitError();
    }

    const code = randomCode();

    await sendOtp({ phone, code });

    await saveOtp(
        phone,
        {
            code,
            attempts: 0,
            lastRequestedAt: Date.now(),
        }
    );
}

async function verifyOtpCode(
    phone: string,
    code: string
): Promise<void> {
    const result = await verifyOtpRedis(
        phone,
        code
    );

    if (
        result === "NOT_FOUND" ||
        result === "MAX_ATTEMPTS" ||
        result === "INVALID"
    ) {
        throw new InvalidOtpError();
    }
}

/* ---------------- PUBLIC DOMAIN API ---------------- */

export async function requestOtp(input: OtpRequestDto) {
    await requestOtpCode(input.phone);
}

export async function verifyOtp(
    input: OtpVerifyDto
): Promise<{ user: AuthUser; token: string }> {
    await verifyOtpCode(input.phone, input.code);

    let user = await authStore.findByPhone(input.phone);

    if (!user) {
        user = {
            userId: crypto.randomUUID(),
            phone: input.phone,
            isSuperadmin: false,
        };

        await authStore.save(user);
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