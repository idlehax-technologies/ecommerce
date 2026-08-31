import { apiFetch } from "./fetch";

import type { TenantAnalytics } from "@/types/analytics";

export async function getAnalytics(): Promise<{
    analytics: TenantAnalytics;
}> {
    return apiFetch<{ analytics: TenantAnalytics }>("/api/analytics");
}