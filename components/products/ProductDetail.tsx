"use client";

import {
    Typography,
    Stack,
    Chip,
    Box,
    Divider,
    Grid,
    Paper,
} from "@mui/material";

import type { TenantProvisioningRow } from "@/lib/mappers/tenantProvisioningView";
import QuantityControl from "@/components/cart/QuantityControl";

type Props = {
    row: TenantProvisioningRow;
};

export default function ProductDetail({ row }: Props) {
    const { product, stock } = row;

    const price = (product.price / 100).toFixed(2);
    const image = product.images?.[0];

    return (
        <Grid container spacing={6}>
            {/* Left: Image */}
            <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={2} sx={{ p: 2 }}>
                    {image ? (
                        <Box
                            component="img"
                            src={image}
                            alt={product.title}
                            sx={{
                                width: "100%",
                                borderRadius: 2,
                                objectFit: "contain",
                            }}
                        />
                    ) : (
                        <Box
                            sx={{
                                width: "100%",
                                height: 300,
                                bgcolor: "grey.100",
                                borderRadius: 2,
                            }}
                        />
                    )}
                </Paper>
            </Grid>

            {/* Right: Details */}
            <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={3}>
                    <Typography variant="h4" fontWeight={600}>
                        {product.title}
                    </Typography>

                    <Typography variant="h5" fontWeight={600}>
                        ₹ {price} (incl. GST)
                    </Typography>

                    <Chip
                        label={
                            stock > 0
                                ? `In stock (${stock} available)`
                                : "Out of stock"
                        }
                        color={stock > 0 ? "success" : "error"}
                        sx={{ width: "fit-content" }}
                    />

                    {product.description && (
                        <>
                            <Divider />
                            <Typography color="text.secondary">
                                {product.description}
                            </Typography>
                        </>
                    )}

                    <Divider />

                    <QuantityControl productId={product.productId} stock={stock} />

                </Stack>
            </Grid>
        </Grid>
    );
}