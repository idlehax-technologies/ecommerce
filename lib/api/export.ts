import { getCsrfToken } from "@/contexts/AuthContext";

export async function exportCSV(payload: {
    type: "ORDERS" | "RECONCILIATION";
}) {
    // apiFetch enforces JSON parsing, so we use raw fetch but still reuse CSRF via apiFetch headers pattern
    const res = await fetch("/api/export", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "x-csrf-token": getCsrfToken() ?? "",
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        // try to extract error using same pattern as apiFetch
        let message = "Export failed";
        try {
            const data = await res.json();
            if (data && typeof data.error === "string") {
                message = data.error;
            }
        } catch {
            // ignore, fallback message
        }
        throw new Error(message);
    }

    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    const disposition = res.headers.get("Content-Disposition");
    const filename =
        disposition?.split("filename=")[1]?.replace(/"/g, "") ??
        "export.csv";

    a.href = url;
    a.download = filename;
    a.click();

    window.URL.revokeObjectURL(url);
}