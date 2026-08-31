"use client";

import { useState } from "react";

import {
    MenuItem,
    Select,
} from "@mui/material";

import type {
    SelectChangeEvent,
} from "@mui/material/Select";

import {
    updateMembershipRole,
} from "@/lib/api/memberships";

import {
    useSnackbar,
} from "@/contexts/SnackbarContext";

import type {
    MembershipView,
    MembershipRole,
} from "@/types/membership";

type Props = {
    membership: MembershipView;
    reload: () => void;
};

export default function MembershipRoleActions({
    membership,
    reload,
}: Props) {
    const { membershipId, role: currentRole, status } = membership;

    const { show } = useSnackbar();

    const [role, setRole] = useState<MembershipRole>(currentRole);

    const [loading, setLoading] = useState(false);

    async function updateRole(
        e: SelectChangeEvent
    ) {
        const nextRole = e.target.value as MembershipRole;

        if (
            loading ||
            nextRole === currentRole ||
            status !== "APPROVED"
        ) {
            return;
        }

        try {
            setLoading(true);
            setRole(nextRole);

            await updateMembershipRole(
                membershipId,
                nextRole
            );

            show("Role updated");
            reload();

        } catch (err: unknown) {
            setRole(currentRole);

            if (err instanceof Error) {
                show(err.message, "error");
            } else {
                show("Failed to update role", "error");
            }

        } finally {
            setLoading(false);
        }
    }

    return (
        <Select
            size="small"
            value={role}
            disabled={
                loading ||
                status !== "APPROVED"
            }
            onChange={updateRole}
            fullWidth
        >
            <MenuItem value="customer">
                Customer
            </MenuItem>
            <MenuItem value="staff">
                Staff
            </MenuItem>
            <MenuItem value="admin">
                Admin
            </MenuItem>
        </Select>
    );
}