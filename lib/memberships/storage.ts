import type { Membership } from "@/types/membership";

const map = new Map<string, Membership>();

export const membershipStore = {
    save(m: Membership) {
        map.set(m.membershipId, m);
    },

    get(id: string) {
        return map.get(id) ?? null;
    },

    getAll() {
        return [...map.values()];
    },

    getByUser(userId: string) {
        return [...map.values()].filter((m) => m.userId === userId);
    },

    getPending() {
        return [...map.values()].filter((m) => m.status === "pending");
    },
};
