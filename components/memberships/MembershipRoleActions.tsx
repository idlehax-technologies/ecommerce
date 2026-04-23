"use client";

import {
    Stack,
    Button,
    MenuItem,
    Select,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";

import { updateMembershipRole } from "@/lib/api/memberships";
import { useSnackbar } from "@/components/common/AppSnackbar";

import type { MembershipView, MembershipRole } from "@/types/membership";

type Props = {
    membership: MembershipView;
    reload: () => void;
};

export default function MembershipRoleActions({
    membership,
    reload,
}: Props) {
    const { membershipId, role: currentRole } = membership;

    const { show } = useSnackbar();

    const [role, setRole] = useState<MembershipRole>(currentRole);
    const [loading, setLoading] = useState(false);

    function handleChange(e: SelectChangeEvent) {
        setRole(e.target.value as MembershipRole);
    }

    async function submit() {
        try {
            setLoading(true);
            await updateMembershipRole(membershipId, role);
            show("Role updated");
            reload();
        } catch {
            show("Update failed", "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Stack direction="row" spacing={2}>
            <Select size="small" value={role} onChange={handleChange}>
                <MenuItem value="customer">customer</MenuItem>
                <MenuItem value="staff">staff</MenuItem>
                <MenuItem value="admin">admin</MenuItem>
            </Select>

            <Button
                variant="contained"
                disabled={loading || role === currentRole}
                onClick={submit}
            >
                Update Role
            </Button>
        </Stack>
    );
}