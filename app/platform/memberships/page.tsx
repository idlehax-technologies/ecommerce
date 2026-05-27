import { Container, Typography } from "@mui/material";

import { getUserFromRequest } from "@/lib/auth";
import { requireSuperadmin } from "@/lib/auth/guards";

import { listAllMembershipsEnriched } from "@/lib/memberships/domain";

import { QUERY_LIMITS } from "@/lib/config/queryLimits";

import MembershipDashboard
    from "@/components/admin/memberships/MembershipDashboard";

export default async function PlatformMembershipsPage() {

    const rawUser = await getUserFromRequest();

    requireSuperadmin(rawUser);

    const memberships =
        listAllMembershipsEnriched(
            QUERY_LIMITS.MEMBERSHIPS
        );

    return (
        <Container sx={{ py: 4 }}>

            <Typography variant="h5" mb={3}>
                Membership Governance
            </Typography>

            <MembershipDashboard
                memberships={memberships}
            />

        </Container>
    );
}