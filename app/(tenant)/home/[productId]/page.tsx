import { notFound } from "next/navigation";
import { Container } from "@mui/material";
import { getUserFromRequest } from "@/lib/session/session";
import { requireMembership } from "@/lib/auth/guards";
import { getTenantInventoryView } from "@/lib/tenantInventory/service";
import ProductDetail from "@/components/products/ProductDetail";

type PageProps = {
  params: Promise<{ productId: string }>;
};

export default async function ProductDetailPage({ params }: PageProps) {
  const { productId } = await params;

  const actor = await requireMembership(await getUserFromRequest());
  const rows = await getTenantInventoryView(actor.tenantId);

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