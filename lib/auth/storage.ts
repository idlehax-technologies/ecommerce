import type { AuthUser } from "@/types/auth";

type OtpRecord = {
    phone: string;
    code: string;
    expiresAt: number;
    attempts: number;
    lastRequestedAt: number;
};

/**
 * Global anchors so Next.js hot reload does not wipe memory.
 */
const globalForAuth = globalThis as unknown as {
    __authUsers?: Map<string, AuthUser>;
    __authOtps?: Map<string, OtpRecord>;
};

const userStore: Map<string, AuthUser> =
    globalForAuth.__authUsers ?? new Map();

const otpStore: Map<string, OtpRecord> =
    globalForAuth.__authOtps ?? new Map();

globalForAuth.__authUsers = userStore;
globalForAuth.__authOtps = otpStore;

/**
 * ---- One-time seed ----
 * Runs only if store is empty.
 */

function seedUsers() {
    if (userStore.size > 0) return;

    const seed: AuthUser[] = [
        {
            userId: "u_customer",
            phone: "9000000001",
            activeMembershipId: "m_u_customer_alpha",
        },
        {
            userId: "u_staff",
            phone: "9000000002",
            activeMembershipId: "m_u_staff_alpha",
        },
        {
            userId: "u_admin",
            phone: "9000000003",
            activeMembershipId: "m_u_admin_alpha",
        },
        {
            userId: "u_superadmin",
            phone: "9000000004",
            isSuperadmin: true,
        },

        {
            userId: "mnsnhs_customer",
            phone: "8000000001",
            activeMembershipId: "m_mnsnhs_customer",
        },
        {
            userId: "mnsnhs_staff",
            phone: "8000000002",
            activeMembershipId: "m_mnsnhs_staff",
        },
        {
            userId: "mnsnhs_admin",
            phone: "8000000003",
            activeMembershipId: "m_mnsnhs_admin",
        },
        {
            userId: "mnsnhs_superadmin",
            phone: "8000000004",
            isSuperadmin: true,
        },
    ];

    for (const u of seed) {
        userStore.set(u.userId, u);
    }
}

seedUsers();

/**
 * ---------- Auth Store ----------
 * Infrastructure only — no business logic.
 */
export const authStore = {
    getById(userId: string): AuthUser | undefined {
        return userStore.get(userId);
    },

    getAll(): AuthUser[] {
        return Array.from(userStore.values());
    },

    findByPhone(phone: string): AuthUser | undefined {
        for (const u of userStore.values()) {
            if (u.phone === phone) return u;
        }
        return undefined;
    },

    save(user: AuthUser) {
        userStore.set(user.userId, user);
    },
};

/**
 * ---------- OTP Store ----------
 * Same structural pattern as authStore.
 */
export const otpStoreApi = {
    get(phone: string): OtpRecord | undefined {
        return otpStore.get(phone);
    },

    save(rec: OtpRecord) {
        otpStore.set(rec.phone, rec);
    },

    delete(phone: string) {
        otpStore.delete(phone);
    },
};