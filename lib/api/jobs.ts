import { apiFetch } from "./fetch";

export async function retryJobApi(jobId: string): Promise<void> {
    await apiFetch(`/api/admin/jobs/${jobId}/retry`, {
        method: "POST",
    });
}