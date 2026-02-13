"use client";

import { Card, CardContent, Typography, Stack } from "@mui/material";

export default function MembershipStatusCard({
    memberships,
}: {
    memberships: any[];
}) {
    if (!memberships.length) return null;

    return (
        <Stack spacing={2} mt={4}>
            {memberships.map((m) => (
                <Card key={m.membershipId}>
                    <CardContent>
                        <Typography>
                            Tenant: {m.tenantId} | Status: {m.status}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Stack>
    );
}
