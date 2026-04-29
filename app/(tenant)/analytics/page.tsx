import { Container, Typography, Stack, Divider } from "@mui/material";

import { getUserFromRequest } from "@/lib/auth";
import { requireTenant, requireMembershipRole } from "@/lib/auth/guards";

import { getTenantAnalytics } from "@/lib/analytics/service";

import AnalyticsSummaryView from "@/components/analytics/AnalyticsSummary";
import ProductTable from "@/components/analytics/ProductTable";

export default async function AnalyticsPage() {

    const rawUser = await getUserFromRequest();

    requireMembershipRole(rawUser, ["admin", "staff"]);

    const actor = requireTenant(rawUser);

    const analytics = getTenantAnalytics(actor.tenantId);

    return (
        <Container sx={{ mt: 6 }}>
            <Typography variant="h4" gutterBottom>
                Analytics
            </Typography>

            <Stack spacing={4}>
                <AnalyticsSummaryView summary={analytics.summary} />

                <Divider />

                <div>
                    <Typography variant="h6" gutterBottom>
                        Top Products
                    </Typography>

                    <ProductTable products={analytics.topProducts} />
                </div>
            </Stack>
        </Container>
    );
}