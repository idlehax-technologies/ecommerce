"use client";

// import Link from "next/link";

import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Stack,
    Typography,
} from "@mui/material";

import ProductImage from "@/components/products/ProductImage";
import QuantityControl from "@/components/cart/QuantityControl";

import { getDiscountedPrice } from "@/lib/calculations/pricing";
import { formatStorePrice } from "@/lib/format/currency";

import type {
    TenantProductRow,
} from "@/lib/mappers/tenantProductView";

type Props = {
    row: TenantProductRow;
};

export default function HomeProductCard({
    row,
}: Props) {

    const { product, available } = row;

    const image = product.images[0];

    const discountedPrice =
        getDiscountedPrice(
            product.price,
            product.discountPercent
        );

    const stockColor =
        available > 0
            ? "success.main"
            : "error.main";

    return (
        <Card
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "box-shadow 0.2s ease",
                "&:hover": {
                    boxShadow: 2,
                },
            }}
        >
            <CardActionArea
                // component={Link}
                // href={`/home/${product.productId}`}
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                }}
            >
                <Box sx={{ position: "relative" }}>
                    <ProductImage
                        src={image}
                        alt={product.title}
                    />

                    <Box
                        sx={{
                            position: "absolute",
                            right: { xs: 6, sm: 10 },
                            bottom: { xs: 5, sm: 8 },

                            px: { xs: 0.375, sm: 0.75 },
                            py: { xs: 0.125, sm: 0.25 },

                            bgcolor: "common.white",
                            color: stockColor,

                            border: 1,
                            borderColor: stockColor,

                            borderRadius: 0.5,
                        }}
                    >
                        <Typography
                            fontWeight={600}
                            color="inherit"
                            sx={{
                                fontSize: {
                                    xs: "0.65rem",
                                    sm: "0.75rem",
                                },
                                lineHeight: 1.4,
                            }}
                        >
                            {available > 0
                                ? `${available} left`
                                : "Out of stock"}
                        </Typography>
                    </Box>
                </Box>

                <CardContent
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        p: { xs: 0.75, sm: 1.25 },
                        "&:last-child": {
                            pb: { xs: 0.75, sm: 1.25 },
                        },
                    }}
                >
                    <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                        }}
                    >
                        {product.title}
                    </Typography>

                    <Box mt={0.5}>
                        {product.discountPercent > 0 ? (
                            <Stack>
                                <Stack
                                    direction="row"
                                    spacing={{ xs: 0.5, sm: 0.75 }}
                                    alignItems="center"
                                    flexWrap="nowrap"
                                >
                                    <Box
                                        sx={{
                                            px: { xs: 0.375, sm: 0.75 },
                                            py: { xs: 0.125, sm: 0.25 },
                                            bgcolor: "#FFE066",
                                            color: "common.black",
                                            borderRadius: 0.5,
                                            display: "inline-flex",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            fontWeight={700}
                                            color="inherit"
                                        >
                                            {formatStorePrice(discountedPrice)}
                                        </Typography>
                                    </Box>

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{
                                            textDecoration: "line-through",
                                            whiteSpace: "nowrap",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {formatStorePrice(product.price)}
                                    </Typography>
                                </Stack>

                                <Typography
                                    variant="caption"
                                    color="success.main"
                                    fontWeight={600}
                                >
                                    {product.discountPercent}% OFF
                                </Typography>
                            </Stack>
                        ) : (
                            <Box
                                sx={{
                                    px: { xs: 0.375, sm: 0.75 },
                                    py: { xs: 0.125, sm: 0.25 },
                                    bgcolor: "#FFE066",
                                    color: "common.black",
                                    borderRadius: 0.5,
                                    display: "inline-flex",
                                    flexShrink: 0,
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    fontWeight={700}
                                    color="inherit"
                                >
                                    {formatStorePrice(product.price)}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </CardContent>
            </CardActionArea>

            <Box
                sx={{
                    px: { xs: 0.75, sm: 1.25 },
                    pb: { xs: 0.75, sm: 1.25 },
                }}
            >
                <QuantityControl
                    productId={product.productId}
                    available={available}
                />
            </Box>
        </Card>
    );
}