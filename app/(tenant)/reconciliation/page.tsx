import { Container, Typography, Box } from "@mui/material";

import { getUserFromRequest } from "@/lib/auth";
import { requireMembershipRole, requireTenant } from "@/lib/auth/guards";

import { getReconciliationReport } from "@/lib/reconciliation/service";

import ReconciliationReportView from "@/components/reconciliation/ReconciliationReportView";
import ExportButtons from "@/components/export/ExportButtons";

export default async function ReconciliationPage() {
    const rawUser = await getUserFromRequest();

    requireMembershipRole(rawUser, ["staff"]);
    const actor = requireTenant(rawUser);

    const report = getReconciliationReport(actor.tenantId);

    return (
        <Container sx={{ mt: 6 }}>
            <Typography variant="h4" gutterBottom>
                Reconciliation
            </Typography>

            <Box mb={2}>
                <ExportButtons />
            </Box>

            <Box mt={3}>
                <ReconciliationReportView report={report} />
            </Box>
        </Container>
    );
}