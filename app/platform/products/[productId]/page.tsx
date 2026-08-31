import { revalidatePath } from "next/cache";

import {
  Container,
  Box,
  Stack,
  Typography,
  Divider,
  Paper,
} from "@mui/material";

import { getUserFromRequest } from "@/lib/session/session";
import { requireSuperadmin } from "@/lib/auth/guards";
import { formatDateTime } from "@/lib/format/datetime";

import {
  activatePlatformProduct,
  deactivatePlatformProduct,
  getPlatformProduct,
} from "@/lib/products/service";

import ProductDetail
  from "@/components/admin/products/ProductDetail";

type PageProps = {
  params: Promise<{ productId: string }>;
};

export default async function ProductDetailPage({
  params,
}: PageProps) {

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

    revalidatePath(`/platform/products/${productId}`);
  }

  return (
    <Container maxWidth="md">

      <Stack
        spacing={3}
        sx={{ p: 6 }}
      >

        <Box>

          <Typography
            variant="h5"
            fontWeight={600}
          >
            Product Details
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Created:{" "}
            {formatDateTime(product.createdAt)}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Updated:{" "}
            {formatDateTime(product.updatedAt)}
          </Typography>

        </Box>

        <Divider />

        <Paper
          elevation={2}
          sx={{ p: 2 }}
        >
          <ProductDetail
            product={product}
            toggleStatus={toggleStatus}
          />
        </Paper>

      </Stack>

    </Container>
  );
}