"use client";

import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import ProductForm from "@/components/vendor/products/ProductForm";
import {
  getVendorProduct,
  updateVendorProduct,
} from "@/lib/api/vendorProducts";
import type { Product } from "@/types/product";

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    getVendorProduct(productId).then(setProduct);
  }, [productId]);

  if (!product) return null;

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>
        Edit Product
      </Typography>

      <ProductForm
        initialData={product}
        submitLabel="Save Changes"
        onSubmit={async (data) => {
          await updateVendorProduct(productId, data);
          router.push("/vendor/products");
        }}
      />
    </Box>
  );
}
