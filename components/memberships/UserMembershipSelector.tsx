"use client";

import { useEffect, useState } from "react";
import {
    Stack,
    Typography,
    Button,
    Paper,
    CircularProgress,
    Chip,
} from "@mui/material";

import {
    fetchMyMemberships,
    selectMembership,
} from "@/lib/api/memberships";

import type { MembershipView } from "@/types/membership";
import MembershipStatusBadge from "./MembershipStatusBadge";
import { useActiveMembership } from "@/hooks/useActiveMembership";
import { useSnackbar } from "@/contexts/SnackbarContext";

export default function UserMembershipSelector() {
    const [list, setList] = useState<MembershipView[]>([]);
    const [loading, setLoading] = useState(true);
    const [switchingId, setSwitchingId] = useState<string | null>(null);

    const { membership: active } = useActiveMembership();
    const { show } = useSnackbar();

    async function load() {
        try {
            setLoading(true);
            const data = await fetchMyMemberships();
            setList(data.memberships);
        } catch (err: unknown) {
            if (err instanceof Error) {
                show(err.message, "error");
            } else {
                show("Failed to load memberships", "error");
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function handleSelect(id: string) {
        try {
            setSwitchingId(id);
            await selectMembership(id);
            show("Switched tenant");
            await load();
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

    if (loading) return <CircularProgress />;

    return (
        <Stack spacing={2}>
            {list.map((m) => {
                const isActive = m.membershipId === active?.membershipId;

                return (
                    <Paper
                        key={m.membershipId}
                        sx={{
                            p: 2,
                            border: isActive ? "2px solid #1976d2" : "1px solid #ddd",
                        }}
                    >
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Typography sx={{ flex: 1 }}>
                                {m.tenant.name} ({m.role})
                            </Typography>

                            <MembershipStatusBadge status={m.status} />

                            {isActive && <Chip label="ACTIVE" color="primary" size="small" />}

                            {m.status === "APPROVED" && !isActive && (
                                <Button
                                    disabled={switchingId === m.membershipId}
                                    onClick={() => handleSelect(m.membershipId)}
                                >
                                    {switchingId === m.membershipId
                                        ? "Switching..."
                                        : "Select"}
                                </Button>
                            )}
                        </Stack>
                    </Paper>
                );
            })}
        </Stack>
    );
}