"use client";

import { Typography, Stack, Chip, Box } from "@mui/material";
import type { PublicProduct } from "@/types/product";

type Props = {
    product: PublicProduct;
};

export default function ProductDetail({ product }: Props) {
    const price = (product.price / 100).toFixed(2);

    return (
        <Stack spacing={2}>
            <Typography variant="h4">{product.title}</Typography>

            <Typography fontWeight={600}>₹ {price}</Typography>

            <Chip
                label={
                    product.stock > 0
                        ? `In stock (${product.stock} available)`
                        : "Out of stock"
                }
                color={product.stock > 0 ? "success" : "error"}
                size="small"
                sx={{ width: "fit-content" }}
            />

            {product.description && (
                <Typography color="text.secondary">
                    {product.description}
                </Typography>
            )}

            {product.images?.length ? (
                <Box
                    component="img"
                    src={product.images[0]}
                    alt={product.title}
                    sx={{ maxWidth: 400, borderRadius: 2 }}
                />
            ) : null}
        </Stack>
    );
}
