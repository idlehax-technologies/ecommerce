import type { UserProfile } from "@/types/profile";

const globalStore = globalThis as any;

const store: Map<string, UserProfile> =
    globalStore.__profileStore ?? new Map();

globalStore.__profileStore = store;

export const profileStore = {
    get(userId: string) {
        return store.get(userId) ?? null;
    },

    save(profile: UserProfile) {
        store.set(profile.userId, profile);
    },
};