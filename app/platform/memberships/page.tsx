import { Box, Stack, Typography, Paper, Divider } from "@mui/material";

import { getUserFromRequest } from "@/lib/session/session";
import { requireSuperadmin } from "@/lib/auth/guards";

import { listAllMembershipsEnriched } from "@/lib/memberships/domain";

import { QUERY_LIMITS } from "@/lib/config/queryLimits";

import MembershipsDashboard
    from "@/components/admin/memberships/MembershipsDashboard";

export default async function PlatformMembershipsPage() {

    const rawUser = await getUserFromRequest();
    requireSuperadmin(rawUser);

    const memberships =
        await listAllMembershipsEnriched(
            QUERY_LIMITS.MEMBERSHIPS
        );

    return (
        <Stack spacing={3} sx={{ p: 4 }}>
            <Box>
                <Typography variant="h5" fontWeight={600}>
                    Membership Governance
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    Manage tenant membership lifecycle and roles
                </Typography>
            </Box>

            <Divider />

            <Paper elevation={2} sx={{ p: 2 }}>
                <MembershipsDashboard
                    memberships={memberships}
                />
            </Paper>
        </Stack>
    );
}