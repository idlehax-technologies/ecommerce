type GlobalNotificationIdempotency = typeof globalThis & {
    __notificationIdempotency?: Map<string, boolean>;
};

const globalStore = globalThis as GlobalNotificationIdempotency;

const store =
    globalStore.__notificationIdempotency ??
    new Map<string, boolean>();

globalStore.__notificationIdempotency = store;

export function isNotificationProcessed(key: string): boolean {
    return store.has(key);
}

export function markNotificationProcessed(key: string) {
    store.set(key, true);
}