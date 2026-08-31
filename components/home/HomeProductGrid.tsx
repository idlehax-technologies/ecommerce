"use client";

import { Grid } from "@mui/material";

import HomeProductCard from "./HomeProductCard";

import type {
    TenantProductRow,
} from "@/lib/mappers/tenantProductView";

type Props = {
    rows: TenantProductRow[];
};

export default function HomeProductGrid({
    rows,
}: Props) {

    return (
        <Grid
            container
            spacing={{ xs: 1, sm: 2 }}
        >
            {rows.map((row) => (
                <Grid
                    key={row.product.productId}
                    size={{
                        xs: 4,
                        sm: 3,
                        md: 2.4,
                        lg: 2,
                    }}
                >
                    <HomeProductCard
                        row={row}
                    />
                </Grid>
            ))}
        </Grid>
    );
}