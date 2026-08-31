"use client";

import {
    Stack,
    Paper,
    Typography,
    Divider,
} from "@mui/material";

import type { Product } from "@/types/product";

import ProductStatusBadge
    from "./ProductStatusBadge";

import ProductLifecycleActions
    from "./ProductLifecycleActions";

import ProductForm
    from "./ProductForm";

import ProductImageCarousel
    from "./ProductImageCarousel";

type Props = {
    product: Product;

    toggleStatus: () => Promise<void>;
};

export default function ProductDetail({
    product,
    toggleStatus,
}: Props) {

    return (
        <Paper
            elevation={2}
            sx={{ p: 2 }}
        >
            <Stack spacing={2}>

                <Typography
                    variant="h5"
                    fontWeight={600}
                >
                    {product.title}
                </Typography>

                <Divider />

                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                >

                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                    >
                        <Typography>
                            <strong>Status:</strong>
                        </Typography>

                        <ProductStatusBadge
                            status={product.status}
                        />
                    </Stack>

                    <Typography>
                        <strong>SKU:</strong>{" "}
                        {product.sku}
                    </Typography>

                </Stack>

                <Divider />

                {product.images.length > 0 && (
                    <>
                        <ProductImageCarousel
                            images={product.images}
                        />

                        <Divider />
                    </>
                )}

                <ProductForm
                    mode="edit"
                    product={product}
                />

                <Divider />

                <ProductLifecycleActions
                    product={product}
                    toggleStatus={toggleStatus}
                />

            </Stack>
        </Paper>
    );
}