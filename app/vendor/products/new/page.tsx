"use client";

import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import ProductForm from "@/components/vendor/products/ProductForm";
import { createVendorProduct } from "@/lib/api/vendorProducts";

export default function NewProductPage() {
  const router = useRouter();

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>
        Create Product
      </Typography>

      <ProductForm
        submitLabel="Create Product"
        onSubmit={async (data) => {
          await createVendorProduct(data);
          router.push("/vendor/products");
        }}
      />
    </Box>
  );
}
