import type { Cart, AddToCartDTO, UpdateCartItemDTO } from "@/types/cart";

const json = { "Content-Type": "application/json" };
async function handle<T>(res: Response): Promise<T> {
    const data: unknown = await res.json().catch(() => ({}));

    if (!res.ok) {
        let message = "Request failed";

        if (
            typeof data === "object" &&
            data !== null &&
            "error" in data &&
            typeof (data as { error?: unknown }).error === "string"
        ) {
            message = (data as { error: string }).error;
        }

        throw new Error(message);
    }

    return data as T;
}

export const getCart = () => fetch("/api/cart").then(handle<Cart>);
export const addToCart = (dto: AddToCartDTO) =>
    fetch("/api/cart", { method: "POST", body: JSON.stringify(dto) }).then(handle<Cart>);
export const updateItem = (id: string, dto: UpdateCartItemDTO) =>
    fetch(`/api/cart/${id}`, { method: "PATCH", body: JSON.stringify(dto) }).then(handle<Cart>);
export const removeItem = (id: string) =>
    fetch(`/api/cart/${id}`, { method: "DELETE" }).then(handle<Cart>);
export const clearCart = () =>
    fetch("/api/cart", { method: "DELETE" }).then(handle<void>);
