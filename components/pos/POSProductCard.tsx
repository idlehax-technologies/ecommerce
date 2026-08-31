"use client";

import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Chip,
    Stack,
    Typography,
} from "@mui/material";

import ProductImage from "@/components/products/ProductImage";

import { getDiscountedPrice } from "@/lib/calculations/pricing";
import { formatINR } from "@/lib/format/currency";

import type {
    POSRowWithAction,
} from "@/lib/mappers/posView";

type Props = {
    row: POSRowWithAction;
};

export default function POSProductCard({
    row,
}: Props) {

    const { product, available, inCart, onSelect } = row;

    const image = product.images?.[0];

    const disabled = available <= 0;

    const discountedPrice =
        getDiscountedPrice(
            product.price,
            product.discountPercent
        );

    return (
        <Card
            sx={{
                height: "100%",
                opacity: disabled ? 0.5 : 1,
            }}
        >
            <CardActionArea
                disabled={disabled}
                onClick={disabled ? undefined : onSelect}
                sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                }}
            >
                <ProductImage
                    src={image}
                    alt={product.title}
                />

                <CardContent sx={{ flexGrow: 1 }}>
                    <Stack
                        spacing={0.5}
                        height="100%"
                    >
                        <Typography fontWeight={600}>
                            {product.title}
                        </Typography>

                        {product.discountPercent > 0 ? (
                            <Stack>
                                <Stack
                                    direction="row"
                                    spacing={0.5}
                                    alignItems="center"
                                >
                                    <Typography fontWeight={600}>
                                        {formatINR(discountedPrice)}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ textDecoration: "line-through" }}
                                    >
                                        {formatINR(product.price)}
                                    </Typography>
                                </Stack>

                                <Typography
                                    variant="body2"
                                    color="success.main"
                                >
                                    {product.discountPercent}
                                    % OFF on MRP
                                </Typography>
                            </Stack>
                        ) : (
                            <Typography fontWeight={600}>
                                {formatINR(product.price)}
                            </Typography>
                        )}

                        <Box flexGrow={1} />

                        <Stack
                            direction="row"
                            spacing={0.75}
                        >
                            {inCart > 0 && (
                                <Chip
                                    size="small"
                                    color="info"
                                    label={`${inCart} in cart`}
                                />
                            )}

                            <Chip
                                size="small"
                                color={
                                    available > 0
                                        ? "success"
                                        : "error"
                                }
                                label={
                                    available > 0
                                        ? `${available} left`
                                        : "Out of stock"
                                }
                            />
                        </Stack>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}