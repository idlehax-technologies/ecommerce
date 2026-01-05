"use client"

import { useParams } from 'next/navigation'
import { products } from "@/lib/products"
import { Container, Typography, Button } from "@mui/material"
import { useCart } from "@/context/CartContext";

export default function ProductPage() {
    const params = useParams()
    const { id } = params;
    const product = products.find(p => p.id === Number(id))

    const { addToCart } = useCart();

    if (!product) {
        return <Container>Product not found</Container>
    }

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4">{product.name}</Typography>
            <Typography sx={{ mt: 2 }}>
                {product.description}
            </Typography>
            <Typography sx={{ mt: 2 }}>
                ₹{product.price}
            </Typography>

            <Button
                variant="contained"
                sx={{ mt: 3 }}
                onClick={() =>
                    addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                    })
                }
            >
                Add to Cart
            </Button>

        </Container>
    )
}
