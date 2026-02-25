// app/(tenant)/products/[productId]/page.tsx

import { notFound } from "next/navigation";
import { Container } from "@mui/material";
import { getUserFromRequest } from "@/lib/auth";
import { requireTenant } from "@/lib/auth/guards";
import { getTenantProvisioningView } from "@/lib/tenantInventory/service";
import ProductDetail from "@/components/products/ProductDetail";

type PageProps = {
  params: Promise<{ productId: string }>;
};

export default async function ProductDetailPage({ params }: PageProps) {
  const { productId } = await params;

  const actor = requireTenant(await getUserFromRequest());
  const { rows } = await getTenantProvisioningView(actor.tenantId);

  const row = rows.find(r => r.product.productId === productId);

  if (!row || !row.enabled) {
    notFound();
  }

  return (
    <Container sx={{ mt: 6 }}>
      <ProductDetail row={row} />
    </Container>
  );
}