"use client";

import { Card, CardContent, Typography, Stack } from "@mui/material";
import ApproveRejectButtons from "./ApproveRejectButtons";

export default function MembershipReviewCard({ m }: { m: any }) {
    return (
        <Card>
            <CardContent>
                <Stack spacing={2}>
                    <Typography>User: {m.userId}</Typography>
                    <Typography>Tenant: {m.tenantId}</Typography>
                    <Typography>Status: {m.status}</Typography>

                    <ApproveRejectButtons id={m.membershipId} />
                </Stack>
            </CardContent>
        </Card>
    );
}
