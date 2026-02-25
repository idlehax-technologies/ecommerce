// app/(tenant)/page.tsx

import { Container, Typography, Box } from "@mui/material";
import { getUserFromRequest } from "@/lib/auth";
import { requireTenant } from "@/lib/auth/guards";
import { getTenantProvisioningView } from "@/lib/tenantInventory/service";
import ProductGrid from "@/components/products/ProductGrid";

export default async function TenantHomePage() {
  const actor = requireTenant(await getUserFromRequest());

  const { rows } = await getTenantProvisioningView(actor.tenantId);

  // Visible storefront products only
  const visible = rows.filter(r => r.enabled);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Products
      </Typography>

      <Box mt={4}>
        <ProductGrid rows={visible} />
      </Box>
    </Container>
  );
}