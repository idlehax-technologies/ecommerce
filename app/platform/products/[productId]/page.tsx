import {
  Container,
  Typography,
  Paper,
  Stack,
  Button,
} from "@mui/material";

import { getUserFromRequest } from "@/lib/auth";
import { requireSuperadmin } from "@/lib/auth/guards";

import {
  activatePlatformProduct,
  deactivatePlatformProduct,
  getPlatformProduct
} from "@/lib/products/service";

import ProductForm from "@/components/admin/products/ProductForm";
import ProductStatusBadge from "@/components/admin/products/ProductStatusBadge";
import ProductImageCarousel from "@/components/admin/products/ProductImageCarousel";

type PageProps = {
  params: Promise<{ productId: string }>;
};

export default async function EditProductPage({ params }: PageProps) {

  const rawUser = await getUserFromRequest();
  requireSuperadmin(rawUser);

  const { productId } = await params;

  const product = await getPlatformProduct(productId);

  async function toggleStatus() {
    "use server";

    if (product.status === "ACTIVE") {
      await deactivatePlatformProduct(product.productId);
    } else {
      await activatePlatformProduct(product.productId);
    }
  }

  return (
    <Container
      maxWidth="md"
      sx={{ py: 4 }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5">
          Edit Product
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
        >
          <ProductStatusBadge
            status={product.status}
          />

          <form action={toggleStatus}>
            <Button
              type="submit"
              variant="outlined"
            >
              {product.status === "ACTIVE"
                ? "Deactivate"
                : "Activate"}
            </Button>
          </form>
        </Stack>
      </Stack>

      <Typography
        variant="body2"
        color="text.secondary"
      >
        SKU: {product.sku}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
      >
        Created:{" "}
        {new Date(
          product.createdAt
        ).toLocaleString()}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
      >
        Updated:{" "}
        {new Date(
          product.updatedAt
        ).toLocaleString()}
      </Typography>

      {product.images &&
        product.images.length > 0 && (
          <ProductImageCarousel
            images={product.images}
          />
        )}

      <Paper sx={{ p: 3 }}>
        <ProductForm
          mode="edit"
          product={product}
        />
      </Paper>
    </Container>
  );
}