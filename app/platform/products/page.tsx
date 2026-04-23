// app/platform/products/page.tsx

import Link from "next/link";
import {
  Container,
  Typography,
  Button,
  Stack,
  Paper,
} from "@mui/material";

import { getUserFromRequest } from "@/lib/auth";
import { requireSuperadmin } from "@/lib/auth/guards";

import { listProductsForPlatform } from "@/lib/products/service";
import ProductTable from "@/components/admin/products/ProductTable";

export default async function PlatformProductsPage() {
  const rawUser = await getUserFromRequest();

  requireSuperadmin(rawUser);

  const products = await listProductsForPlatform();

  return (
    <Container sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h5">Products</Typography>

        <Link href="/platform/products/new">
          <Button variant="contained">New Product</Button>
        </Link>
      </Stack>

      <Paper>
        <ProductTable products={products} />
      </Paper>
    </Container>
  );
}