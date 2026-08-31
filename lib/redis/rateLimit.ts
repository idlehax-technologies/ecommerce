import { TooManyRequestsError } from "../security/errors";
import { redis } from "./client";

const WINDOW_TTL_SECONDS = 60;
const REQUEST_LIMIT = 60;

function buildKey(key: string): string {
    return `rate-limit:${key}`;
}

export async function rateLimit(
    key: string
): Promise<void> {
    const redisKey = buildKey(key);

    const script = `
        local count = redis.call("INCR", KEYS[1])

        if count == 1 then
            redis.call(
                "EXPIRE",
                KEYS[1],
                ARGV[1]
            )
        end

        if count > tonumber(ARGV[2]) then
            return "LIMITED"
        end

        return "OK"
    `;

    const result = await redis.eval(
        script,
        [redisKey],
        [
            WINDOW_TTL_SECONDS,
            REQUEST_LIMIT,
        ]
    );

    if (result === "LIMITED") {
        throw new TooManyRequestsError();
    }

    if (result !== "OK") {
        throw new Error("Unexpected rate limit result");
    }
}