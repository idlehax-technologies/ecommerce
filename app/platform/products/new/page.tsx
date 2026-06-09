import {
  Container,
  Typography,
  Paper,
} from "@mui/material";

import { getUserFromRequest } from "@/lib/auth";
import { requireSuperadmin } from "@/lib/auth/guards";

import ProductForm from "@/components/admin/products/ProductForm";

export default async function NewProductPage() {

  const rawUser = await getUserFromRequest();
  requireSuperadmin(rawUser);

  return (
    <Container
      maxWidth="md"
      sx={{ py: 4 }}
    >
      <Typography
        variant="h5"
        mb={3}
      >
        New Product
      </Typography>

      <Paper sx={{ p: 3 }}>
        <ProductForm mode="create" />
      </Paper>
    </Container>
  );
}