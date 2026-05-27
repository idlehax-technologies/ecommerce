import type { UserProfile } from "@/types/profile";

const globalStore = globalThis as {
    __profileStore?: Map<string, UserProfile>;
};

const store: Map<string, UserProfile> =
    globalStore.__profileStore ?? new Map();

globalStore.__profileStore = store;

export const profileStore = {
    get(userId: string): UserProfile | null {
        const profile = store.get(userId);

        return profile
            ? { ...profile }
            : null;
    },

    save(profile: UserProfile): void {
        store.set(profile.userId, {
            ...profile,
        });
    },
};