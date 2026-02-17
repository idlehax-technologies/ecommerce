"use client";

import { useEffect, useState } from "react";
import { Container, Typography, CircularProgress, Alert } from "@mui/material";

import type { PublicProduct } from "@/types/product";
import { listProducts } from "@/lib/api/products";
import ProductGrid from "@/components/products/ProductGrid";

export default function ProductsPage() {
    const [products, setProducts] = useState<PublicProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError(null);

            try {
                const data = await listProducts();
                setProducts(data);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Failed to load products");
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

    if (error) {
        return (
            <Container sx={{ mt: 6 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom textAlign="center">
                Products
            </Typography>

            <ProductGrid products={products} />
        </Container>
    );
}
