type Store = Map<string, { count: number; ts: number }>;

const globalStore = globalThis as unknown as {
    __rateLimit?: Store;
};

const store: Store =
    globalStore.__rateLimit ?? new Map();

globalStore.__rateLimit = store;

const WINDOW = 60_000; // 1 min
const LIMIT = 60;

export function rateLimit(key: string): void {
    const now = Date.now();

    const entry = store.get(key);

    if (!entry) {
        store.set(key, { count: 1, ts: now });
        return;
    }

    if (now - entry.ts > WINDOW) {
        store.set(key, { count: 1, ts: now });
        return;
    }

    entry.count++;

    if (entry.count > LIMIT) {
        throw new Error("Too many requests");
    }
}