"use client";

import { Stack, Button } from "@mui/material";
import { approveMembership, rejectMembership } from "@/lib/api/memberships";

export default function ApproveRejectButtons({ id }: { id: string }) {
    return (
        <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={() => approveMembership(id)}>
                Approve
            </Button>
            <Button color="error" onClick={() => rejectMembership(id)}>
                Reject
            </Button>
        </Stack>
    );
}
