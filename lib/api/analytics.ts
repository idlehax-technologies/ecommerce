import type { TenantAnalytics } from "@/types/analytics";

export async function getAnalytics(): Promise<TenantAnalytics> {
    const res = await fetch("/api/analytics", {
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch analytics");
    }

    return res.json();
}