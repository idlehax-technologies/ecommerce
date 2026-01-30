"use client";

// import { useEffect, useState } from "react";
import { Container, Grid, Typography } from "@mui/material";
// import type { Product } from "@/types/product";

export default function Home() {
  // const [products, setProducts] = useState<Product[]>([]);

  // useEffect(() => {
  //   async function loadProducts() {
  //     const res = await fetch("/api/vendor/products");
  //     if (!res.ok) return;

  //     const data = await res.json();
  //     setProducts(data.products);
  //   }

  //   loadProducts();
  // }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
        Products
      </Typography>

    </Container>
  );
}
