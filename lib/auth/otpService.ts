import { saveOtp, getOtp, deleteOtp } from "./storage";
import { InvalidOtpError, OtpRateLimitError } from "./errors";

const EXPIRY_MS = 2 * 60 * 1000;
const RESEND_COOLDOWN = 30 * 1000;
const MAX_ATTEMPTS = 5;

const randomCode = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

export async function sendOtp(phone: string) {
    const existing = getOtp(phone);

    if (existing && Date.now() - existing.lastRequestedAt < RESEND_COOLDOWN) {
        throw new OtpRateLimitError();
    }

    // const code = randomCode();
    const code = "123456";

    saveOtp({
        phone,
        code,
        expiresAt: Date.now() + EXPIRY_MS,
        attempts: 0,
        lastRequestedAt: Date.now(),
    });

    console.log(`OTP for ${phone}: ${code}`);
}

export function verifyOtp(phone: string, code: string) {
    const rec = getOtp(phone);
    if (!rec) throw new InvalidOtpError();

    if (rec.expiresAt < Date.now()) {
        deleteOtp(phone);
        throw new InvalidOtpError();
    }

    if (rec.attempts >= MAX_ATTEMPTS) {
        deleteOtp(phone);
        throw new InvalidOtpError();
    }

    if (rec.code !== code) {
        rec.attempts++;
        saveOtp(rec);
        throw new InvalidOtpError();
    }

    deleteOtp(phone);
}
