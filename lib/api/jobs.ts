import { apiFetch } from "./fetch";

export async function retryJobApi(
    jobId: string
): Promise<{ success: true }> {
    return apiFetch<{ success: true }>(
        `/api/admin/jobs/${jobId}/retry`,
        {
            method: "POST",
        }
    );
}