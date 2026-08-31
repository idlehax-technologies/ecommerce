import { redis } from "./client";

const IDEMPOTENCY_TTL_SECONDS = 24 * 60 * 60;

type IdempotencyNamespace =
    | "inventory"
    | "reconciliation"
    | "notification";

function buildKey(
    namespace: IdempotencyNamespace,
    key: string
): string {
    return `idempotency:${namespace}:${key}`;
}

export async function claimIdempotencyKey(
    namespace: IdempotencyNamespace,
    key: string
): Promise<boolean> {
    const redisKey = buildKey(namespace, key);

    const result = await redis.set(
        redisKey,
        "1",
        {
            nx: true,
            ex: IDEMPOTENCY_TTL_SECONDS,
        }
    );

    return result === "OK";
}

export async function claimInventoryIdempotency(
    key: string
): Promise<boolean> {
    return claimIdempotencyKey(
        "inventory",
        key
    );
}

export async function claimReconciliationIdempotency(
    key: string
): Promise<boolean> {
    return claimIdempotencyKey(
        "reconciliation",
        key
    );
}

export async function claimNotificationIdempotency(
    key: string
): Promise<boolean> {
    return claimIdempotencyKey(
        "notification",
        key
    );
}

export async function releaseNotificationIdempotency(
    key: string
): Promise<void> {
    const redisKey = buildKey(
        "notification",
        key
    );

    await redis.del(redisKey);
}