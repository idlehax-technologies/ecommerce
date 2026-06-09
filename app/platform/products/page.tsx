import Link from "next/link";

import {
  Container,
  Typography,
  Stack,
  Button,
  Paper,
} from "@mui/material";

import { getUserFromRequest } from "@/lib/auth";
import { requireSuperadmin } from "@/lib/auth/guards";

import { QUERY_LIMITS } from "@/lib/config/queryLimits";

import { listPlatformProducts } from "@/lib/products/service";

import ProductTable from "@/components/admin/products/ProductTable";

export default async function ProductsPage() {

  const rawUser = await getUserFromRequest();
  requireSuperadmin(rawUser);

  const products = await listPlatformProducts(QUERY_LIMITS.PRODUCTS);

  return (
    <Container sx={{ py: 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        mb={3}
      >
        <Typography variant="h5">
          Products
        </Typography>

        <Link href="/platform/products/new">
          <Button variant="contained">
            New Product
          </Button>
        </Link>
      </Stack>

      <Paper>
        <ProductTable
          products={products}
        />
      </Paper>
    </Container>
  );
}