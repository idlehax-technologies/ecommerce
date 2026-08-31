"use client";

import {
    Button,
    Stack,
} from "@mui/material";

import type { Product } from "@/types/product";

type Props = {
    product: Product;

    toggleStatus: () => Promise<void>;
};

export default function ProductLifecycleActions({
    product,
    toggleStatus,
}: Props) {

    return (
        <Stack direction="row">
            <form action={toggleStatus}>
                <Button
                    type="submit"
                    variant="contained"
                    color={
                        product.status === "ACTIVE"
                            ? "warning"
                            : "success"
                    }
                >
                    {product.status === "ACTIVE"
                        ? "Deactivate"
                        : "Activate"}
                </Button>
            </form>
        </Stack>
    );
}