import { redis } from "./client";

const OTP_TTL_SECONDS = 5 * 60;
const OTP_MAX_ATTEMPTS = 5;

type OtpRecord = {
    code: string;
    attempts: number;
    lastRequestedAt: number;
};

type VerifyOtpResult =
    | "NOT_FOUND"
    | "MAX_ATTEMPTS"
    | "INVALID"
    | "SUCCESS";

function buildKey(phone: string): string {
    return `otp:${phone}`;
}

export async function getOtp(
    phone: string
): Promise<OtpRecord | null> {
    return redis.get<OtpRecord>(
        buildKey(phone)
    );
}

export async function saveOtp(
    phone: string,
    record: OtpRecord
): Promise<void> {
    await redis.set(
        buildKey(phone),
        record,
        {
            ex: OTP_TTL_SECONDS,
        }
    );
}

export async function verifyOtp(
    phone: string,
    code: string
): Promise<VerifyOtpResult> {
    const redisKey = buildKey(phone);

    const script = `
        local value = redis.call("GET", KEYS[1])

        if not value then
            return "NOT_FOUND"
        end

        local record = cjson.decode(value)

        if record.attempts >= tonumber(ARGV[2]) then
            redis.call("DEL", KEYS[1])
            return "MAX_ATTEMPTS"
        end

        if record.code ~= ARGV[1] then
            record.attempts = record.attempts + 1

            redis.call(
                "SET",
                KEYS[1],
                cjson.encode(record),
                "KEEPTTL"
            )

            return "INVALID"
        end

        redis.call("DEL", KEYS[1])

        return "SUCCESS"
    `;

    const result = await redis.eval(
        script,
        [redisKey],
        [code, OTP_MAX_ATTEMPTS]
    );

    if (
        result !== "NOT_FOUND" &&
        result !== "MAX_ATTEMPTS" &&
        result !== "INVALID" &&
        result !== "SUCCESS"
    ) {
        throw new Error("Unexpected OTP verification result");
    }

    return result;
}