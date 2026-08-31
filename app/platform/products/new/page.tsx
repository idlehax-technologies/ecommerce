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

import ProductForm from "@/components/admin/products/ProductForm";

export default async function CreateProductPage() {

  const rawUser = await getUserFromRequest();
  requireSuperadmin(rawUser);

  return (
    <Container maxWidth="md">
      <Stack spacing={3} sx={{ p: 6 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Create Product
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Register a new platform product
          </Typography>
        </Box>

        <Divider />

        <Paper elevation={2} sx={{ p: 2 }}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <ProductForm
              mode="create"
            />
          </Paper>
        </Paper>
      </Stack>
    </Container>
  );
}