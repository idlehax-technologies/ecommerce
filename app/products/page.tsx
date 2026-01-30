"use client";

import { useEffect, useState } from "react";
import { Container, Grid, Typography, CircularProgress } from "@mui/material";
import type { PublicProduct } from "@/types/product";
import { listProducts } from "@/lib/api/products";
import ProductCard from "@/components/products/ProductCard";

export default function ProductsPage() {
    const [products, setProducts] = useState<PublicProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await listProducts();
                setProducts(data);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) {
        return (
            <Container sx={{ mt: 6, textAlign: "center" }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
                Products
            </Typography>

            <Grid container spacing={2}>
                {products.map((product) => (
                    <Grid key={product.productId} size={{ xs: 12, sm: 6, md: 4 }}>
                        <ProductCard product={product} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
