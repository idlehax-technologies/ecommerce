type GlobalIdempotency = typeof globalThis & {
    __reconciliationIdempotency?: Map<string, boolean>;
};

const globalForIdempotency = globalThis as GlobalIdempotency;

const store =
    globalForIdempotency.__reconciliationIdempotency ??
    new Map<string, boolean>();

globalForIdempotency.__reconciliationIdempotency = store;

/**
 * Returns true if already processed
 */
export function isAlreadyProcessed(key: string): boolean {
    return store.has(key);
}

/**
 * Mark as processed
 */
export function markProcessed(key: string): void {
    store.set(key, true);
}