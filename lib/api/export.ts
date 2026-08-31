import { CSRF_HEADER } from "../auth/cookies";
import { getCsrfToken } from "../security/csrfClient";
import type { ExportRequest } from "@/types/export";

export async function exportCSV(
    payload: ExportRequest
): Promise<void> {
    // apiFetch enforces JSON parsing, so we use raw fetch but still reuse CSRF via apiFetch headers pattern
    const res = await fetch("/api/export", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            [CSRF_HEADER]: getCsrfToken() ?? "",
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        // Try extracting structured backend error.
        // Fallback safely if response is not JSON.
        let message = "Export failed";
        try {
            const data: unknown =
                await res.json();
            if (
                data &&
                typeof data === "object" &&
                "error" in data &&
                typeof data.error === "string"
            ) {
                message = data.error;
            }
        } catch {
            // Ignore parse failure and keep fallback message
        }
        throw new Error(message);
    }

    const blob = await res.blob();

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    const disposition = res.headers.get("Content-Disposition");
    const filename =
        disposition?.split("filename=")[1]?.replace(/"/g, "") ??
        "export.csv";

    a.href = url;
    a.download = filename;

    document.body.appendChild(a);

    a.click();
    a.remove();

    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 0);
}