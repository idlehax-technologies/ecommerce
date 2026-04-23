"use client";

import { Card, CardContent, Typography, Stack, Divider } from "@mui/material";
import type { MembershipView } from "@/types/membership";
import MembershipStatusBadge from "./MembershipStatusBadge";
import MembershipLifecycleActions from "./MembershipLifecycleActions";
import MembershipRoleActions from "./MembershipRoleActions";
import { useAuth } from "@/contexts/AuthContext";

export default function MembershipDetailCard({
    m,
    reload,
}: {
    m: MembershipView;
    reload: () => void;
}) {
    const { user } = useAuth();
    return (
        <Card>
            <CardContent>
                <Stack spacing={3}>
                    {/* <Typography variant="h6">Membership Details</Typography> */}
                    {/* HEADER */}
                    <Stack>
                        <Typography variant="h5">
                            {m.user.fullName || "Unnamed User"}
                        </Typography>

                        <Typography color="text.secondary">
                            {m.user.email} • {m.user.phone}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                            Created: {new Date(m.createdAt).toLocaleString()}
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
                            <strong>Address:</strong> {m.user.addressText || "-"}
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

                        {user?.isSuperadmin && (
                            <MembershipRoleActions
                                membership={m}
                                reload={reload}
                            />
                        )}
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}