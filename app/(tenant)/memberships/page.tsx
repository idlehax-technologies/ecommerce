"use client";

import { Container, Typography } from "@mui/material";
import MembershipDashboard from "@/components/memberships/MembershipDashboard";

export default function Page() {
    return (
        <Container>
            <Typography variant="h5" mb={2}>
                Membership Dashboard
            </Typography>

            <MembershipDashboard />
        </Container>
    );
}