"use client";

import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Chip,
    Stack,
    CardActionArea,
} from "@mui/material";

import type { POSRow } from "@/lib/mappers/posView";

type POSRowWithAction = POSRow & {
    onSelect: () => void;
};

type Props = {
    row: POSRowWithAction;
};

export default function POSProductCard({ row }: Props) {
    const { product, stock, reserved, available, onSelect } = row;

    const price = (product.price / 100).toFixed(2);
    const image = product.images?.[0];

    const disabled = available <= 0;

    return (
        <Card
            sx={{
                opacity: disabled ? 0.5 : 1,
                cursor: disabled ? "not-allowed" : "pointer",
            }}
        >
            <CardActionArea
                disabled={disabled}
                onClick={!disabled ? onSelect : undefined}
            >
                {image && (
                    <CardMedia
                        component="img"
                        height="160"
                        image={image}
                        alt={product.title}
                    />
                )}

                <CardContent>
                    <Stack spacing={1}>
                        <Typography fontWeight={600}>
                            {product.title}
                        </Typography>

                        <Typography>
                            ₹ {price}
                        </Typography>

                        {/* 🔥 Stock + reservation feedback */}
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            <Chip
                                label={`Stock: ${stock}`}
                                size="small"
                            />

                            {reserved > 0 && (
                                <Chip
                                    label={`${reserved} reserved`}
                                    color="warning"
                                    size="small"
                                />
                            )}

                            <Chip
                                label={
                                    available > 0
                                        ? `${available} left`
                                        : "Out of stock"
                                }
                                color={available > 0 ? "success" : "error"}
                                size="small"
                            />
                        </Stack>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}