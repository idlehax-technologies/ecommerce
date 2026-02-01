"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Typography,
  CircularProgress,
  Button,
  Stack,
} from "@mui/material";
import type { PublicProduct } from "@/types/product";
import { getProduct } from "@/lib/api/products";

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<PublicProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const p = await getProduct(productId);
        setProduct(p);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [productId]);

  if (loading) {
    return (
      <Container sx={{ mt: 6, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!product) {
    return (
      <Container sx={{ mt: 6, textAlign: "center" }}>
        <Typography>Product not found</Typography>
        <Button onClick={() => router.push("/products")}>Back</Button>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 6 }}>
      <Stack spacing={2}>
        <Typography variant="h4">{product.title}</Typography>
        <Typography>Price: ₹{product.price}</Typography>
        <Typography>Stock: {product.stock}</Typography>

        {product.description && (
          <Typography color="text.secondary">
            {product.description}
          </Typography>
        )}
      </Stack>
    </Container>
  );
}





// "use client"

// import { useParams } from 'next/navigation'
// import { products } from "@/lib/products"
// import { Container, Typography, Button } from "@mui/material"
// import { useCart } from "@/context/CartContext";

// export default function ProductPage() {
//     const params = useParams()
//     const { productId } = params;
//     const product = products.find(p => p.productId === Number(productId))

//     const { addToCart } = useCart();

//     if (!product) {
//         return <Container>Product not found</Container>
//     }

//     return (
//         <Container sx={{ mt: 4 }}>
//             <Typography variant="h4">{product.name}</Typography>
//             <Typography sx={{ mt: 2 }}>
//                 {product.description}
//             </Typography>
//             <Typography sx={{ mt: 2 }}>
//                 ₹{product.price}
//             </Typography>

//             <Button
//                 variant="contained"
//                 sx={{ mt: 3 }}
//                 onClick={() =>
//                     addToCart({
//                         productId: product.productId,
//                         vendorId: product.vendorId,
//                         name: product.name,
//                         price: product.price,
//                     })
//                 }
//             >
//                 Add to Cart
//             </Button>

//         </Container>
//     )
// }
