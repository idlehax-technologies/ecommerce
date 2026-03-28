import { Container, Typography, Box } from "@mui/material";
import { getUserFromRequest } from "@/lib/auth";
import { requireTenant, requireRole } from "@/lib/auth/guards";

import POSClient from "@/components/pos/POSClient";

export default async function POSPage() {
    const user = await getUserFromRequest();

    requireRole(user, "staff");
    requireTenant(user);

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