import { Container, Typography, Box } from "@mui/material";
import { getUserFromRequest } from "@/lib/auth";
import { requireTenant, requireMembershipRole } from "@/lib/auth/guards";
import { listAuditByTenant } from "@/lib/audit/storage";
import AuditTimeline from "@/components/audit/AuditTimeline";

export default async function AuditPage() {

    const rawUser = await getUserFromRequest();
    requireMembershipRole(rawUser, ["admin", "staff"]);
    const actor = requireTenant(rawUser);

    const logs = listAuditByTenant(actor.tenantId);

    return (
        <Container sx={{ mt: 6 }}>
            <Typography variant="h4">Audit Logs</Typography>

            <Box mt={3}>
                <AuditTimeline logs={logs} />
            </Box>
        </Container>
    );
}