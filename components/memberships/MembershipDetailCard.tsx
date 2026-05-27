"use client";

import { Card, CardContent, Typography, Stack, Divider } from "@mui/material";
import type { MembershipView } from "@/types/membership";
import MembershipStatusBadge from "./MembershipStatusBadge";
import MembershipLifecycleActions from "./MembershipLifecycleActions";

type Props = {
    m: MembershipView;
    reload: () => void;
};

export default function MembershipDetailCard({
    m,
    reload,
}: Props) {

    return (
        <Card>
            <CardContent>
                <Stack spacing={3}>
                    {/* HEADER */}
                    <Stack>
                        <Typography variant="h5">
                            {m.user.fullName}
                        </Typography>

                        <Typography color="text.secondary">
                            {m.user.phone} • {m.user.email}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                            Created: {new Date(m.createdAt).toLocaleString()}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                            Updated: {new Date(m.updatedAt).toLocaleString()}
                        </Typography>
                    </Stack>

                    <Divider />

                    {/* STATUS + ROLE */}
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography>Status:</Typography>
                            <MembershipStatusBadge status={m.status} />
                        </Stack>

                        <Typography>
                            <strong>Role:</strong> {m.role}
                        </Typography>
                    </Stack>

                    <Divider />

                    {/* USER DETAILS */}
                    <Stack spacing={1}>
                        <Typography variant="subtitle1">User Details</Typography>

                        <Typography>
                            <strong>Name:</strong> {m.user.fullName}
                        </Typography>

                        <Typography>
                            <strong>Email:</strong> {m.user.email}
                        </Typography>

                        <Typography>
                            <strong>Phone:</strong> {m.user.phone}
                        </Typography>

                        <Typography>
                            <strong>Address:</strong> {m.user.addressText}
                        </Typography>
                    </Stack>

                    <Divider />

                    {/* TENANT */}
                    <Stack spacing={1}>
                        <Typography variant="subtitle1">Tenant</Typography>

                        <Typography>
                            <strong>Name:</strong> {m.tenant.name}
                        </Typography>
                    </Stack>

                    <Divider />

                    {/* ACTIONS */}
                    <Stack spacing={2}>
                        <Typography variant="subtitle1">Actions</Typography>

                        <MembershipLifecycleActions
                            membership={m}
                            reload={reload}
                        />
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}