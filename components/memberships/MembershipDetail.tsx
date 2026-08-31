"use client";

import { Typography, Stack, Divider, Paper, capitalize } from "@mui/material";
import type { MembershipView } from "@/types/membership";
import MembershipStatusBadge from "./MembershipStatusBadge";
import MembershipLifecycleActions from "./MembershipLifecycleActions";

type Props = {
    membership: MembershipView;
    reload: () => void;
};

export default function MembershipDetail({
    membership,
    reload,
}: Props) {

    return (
        <Paper elevation={2} sx={{ p: 2 }}>
            <Stack spacing={2}>
                {/* HEADER */}
                <Typography variant="h5" fontWeight={600}>
                    {membership.user.fullName}
                </Typography>

                <Divider />

                {/* STATUS + ROLE */}
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography>
                            <strong>Status:</strong>
                        </Typography>
                        <MembershipStatusBadge status={membership.status} />
                    </Stack>

                    <Typography>
                        <strong>Role:</strong> {capitalize(membership.role)}
                    </Typography>
                </Stack>

                <Divider />

                {/* USER DETAILS */}
                <Stack spacing={1}>
                    <Typography variant="subtitle1">User Details</Typography>

                    <Typography>
                        <strong>Email:</strong> {membership.user.email}
                    </Typography>

                    <Typography>
                        <strong>Phone:</strong> {membership.user.phone}
                    </Typography>

                    <Typography>
                        <strong>Address:</strong> {membership.user.addressText}
                    </Typography>
                </Stack>

                <Divider />

                {/* ACTIONS */}
                <MembershipLifecycleActions
                    membership={membership}
                    reload={reload}
                />
            </Stack>
        </Paper>
    );
}