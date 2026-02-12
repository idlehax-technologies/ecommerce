import type { UserRole } from "@/types/auth";

export interface DBUser {
    userId: string;
    phone: string;
    role: UserRole;
    tenantId: string | null;
}

export interface OtpRecord {
    phone: string;
    code: string;
    expiresAt: number;
    attempts: number;
    lastRequestedAt: number;
}


const globalAny = globalThis as any;

const users: Map<string, DBUser> =
    globalAny.__users ?? (globalAny.__users = new Map());

const otps: Map<string, OtpRecord> =
    globalAny.__otps ?? (globalAny.__otps = new Map());

// ---------- users ----------

export const getUserById = (id: string) =>
    users.get(id) ?? null;

export const findUserByPhone = (phone: string) => {
    for (const u of users.values()) if (u.phone === phone) return u;
    return null;
};

export const createUser = (phone: string): DBUser => {
    const u: DBUser = {
        userId: crypto.randomUUID(),
        phone,
        role: "customer",
        tenantId: null,
    };
    users.set(u.userId, u);
    return u;
};

// ---------- otp ----------

export const saveOtp = (rec: OtpRecord) =>
    otps.set(rec.phone, rec);

export const getOtp = (phone: string) =>
    otps.get(phone);

export const deleteOtp = (phone: string) =>
    otps.delete(phone);
