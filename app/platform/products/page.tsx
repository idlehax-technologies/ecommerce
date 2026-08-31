import Link from "next/link";

import {
  Box,
  Typography,
  Stack,
  Button,
  Paper,
  Divider,
} from "@mui/material";

import { getUserFromRequest } from "@/lib/session/session";
import { requireSuperadmin } from "@/lib/auth/guards";

import { listPlatformProducts } from "@/lib/products/service";

import { QUERY_LIMITS } from "@/lib/config/queryLimits";

import ProductsDashboard
  from "@/components/admin/products/ProductsDashboard";

export default async function ProductsPage() {

  const rawUser = await getUserFromRequest();
  requireSuperadmin(rawUser);

  const products =
    await listPlatformProducts(
      QUERY_LIMITS.PRODUCTS
    );

  return (
    <Stack spacing={3} sx={{ p: 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Products
          </Typography>

          <Typography variant="body2" color="text.secondary">
            View and manage platform products
          </Typography>
        </Box>

        <Link href="/platform/products/new">
          <Button variant="contained">
            New Product
          </Button>
        </Link>
      </Stack>

      <Divider />

      <Paper elevation={2} sx={{ p: 2 }}>
        <ProductsDashboard
          products={products}
        />
      </Paper>
    </Stack>
  );
}