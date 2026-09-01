"use client";

import { useState } from "react";

import {
    Stack,
    Typography,
    Button,
    Paper,
    CircularProgress,
    Chip,
    capitalize,
} from "@mui/material";

import {
    selectMembership,
} from "@/lib/api/memberships";

import type { MembershipView } from "@/types/membership";
import MembershipStatusBadge from "./MembershipStatusBadge";
import { useSnackbar } from "@/contexts/SnackbarContext";
import { useActiveMembership } from "@/hooks/useActiveMembership";
import { getMembershipLandingPage } from "@/lib/navigation/defaultLandingPage";

export default function UserMembershipSelector({
    memberships,
    loading,
}: {
    memberships: MembershipView[];
    loading: boolean;
}) {
    const { show } = useSnackbar();
    const { membership: active, loading: membershipLoading } = useActiveMembership();

    const [switchingId, setSwitchingId] = useState<string | null>(null);

    async function handleSelect(
        membershipId: string,
        role: MembershipView["role"]
    ) {
        try {
            setSwitchingId(membershipId);
            await selectMembership(membershipId);
            show("Switched tenant");
            // eslint-disable-next-line react-hooks/immutability
            window.location.href = getMembershipLandingPage(role);

        } catch (err: unknown) {
            if (err instanceof Error) {
                show(err.message, "error");
            } else {
                show("Switch failed", "error");
            }

        } finally {
            setSwitchingId(null);
        }
    }

    if (
        loading ||
        membershipLoading
    ) {
        return <CircularProgress />;
    }

    return (
        <Stack spacing={2}>
            <Typography variant="h6" fontWeight={600}>
                Memberships
            </Typography>

            {memberships.map((m) => {
                const isActive = m.membershipId === active?.membershipId;

                return (
                    <Paper
                        key={m.membershipId}
                        sx={{
                            p: 2,
                            border: 1,
                            borderColor: isActive ? "primary.main" : "divider",
                            borderWidth: isActive ? 2 : 1,
                        }}
                    >
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1}
                            alignItems={{ xs: "stretch", sm: "center" }}
                        >
                            <Typography sx={{ flex: 1 }}>
                                {m.tenant.name} • {capitalize(m.role)}
                            </Typography>

                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                flexWrap="wrap"
                                useFlexGap
                            >
                                <MembershipStatusBadge status={m.status} />

                                {m.status === "APPROVED" && isActive && (
                                    <Chip label="ACTIVE" color="primary" size="small" />
                                )}

                                {m.status === "APPROVED" && !isActive && (
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        disabled={switchingId === m.membershipId}
                                        onClick={() => handleSelect(m.membershipId, m.role)}
                                    >
                                        {switchingId === m.membershipId
                                            ? "Switching..."
                                            : "Select"}
                                    </Button>
                                )}
                            </Stack>
                        </Stack>
                    </Paper>
                );
            })}
        </Stack>
    );
}