async function handle(res: Response) {
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Request failed");
    return data;
}

export const requestOtp = (phone: string) =>
    fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
    }).then(handle);

export const verifyOtp = (phone: string, code: string) =>
    fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
    }).then(handle);

export const logout = () =>
    fetch("/api/auth/logout", { method: "POST" }).then(handle);

export const me = () =>
    fetch("/api/auth/me").then(handle);
