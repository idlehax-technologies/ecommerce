import { Container, Typography, Box } from "@mui/material";
import { getUserFromRequest } from "@/lib/auth";
import { requireMembershipRole, requireTenant } from "@/lib/auth/guards";

import POSClient from "@/components/pos/POSClient";

export default async function POSPage() {
    const rawUser = await getUserFromRequest();

    requireMembershipRole(rawUser, ["staff"]);
    requireTenant(rawUser);

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Staff POS
            </Typography>

            <Box mt={3}>
                <POSClient />
            </Box>
        </Container>
    );
}