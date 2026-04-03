type GlobalIdempotency = typeof globalThis & {
    __inventoryIdempotency?: Map<string, boolean>;
};

const globalStore = globalThis as GlobalIdempotency;

const store =
    globalStore.__inventoryIdempotency ??
    new Map<string, boolean>();

globalStore.__inventoryIdempotency = store;

export function isInventoryProcessed(key: string): boolean {
    return store.has(key);
}

export function markInventoryProcessed(key: string) {
    store.set(key, true);
}