import { otpStoreApi } from "./storage";
import { InvalidOtpError, OtpRateLimitError } from "./errors";

const EXPIRY_MS = 2 * 60 * 1000;
const RESEND_COOLDOWN = 30 * 1000;
const MAX_ATTEMPTS = 5;

const randomCode = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

export async function sendOtp(phone: string) {
    const existing = otpStoreApi.get(phone);

    if (existing && Date.now() - existing.lastRequestedAt < RESEND_COOLDOWN) {
        throw new OtpRateLimitError();
    }

    // const code = randomCode();
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

export function verifyOtp(phone: string, code: string) {
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
