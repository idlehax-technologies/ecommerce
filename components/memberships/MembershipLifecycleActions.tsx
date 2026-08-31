"use client";

import {
    Stack,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { useState } from "react";
import {
    approveMembership,
    rejectMembership,
    revokeMembership,
} from "@/lib/api/memberships";
import { useSnackbar } from "@/contexts/SnackbarContext";
import { MembershipView } from "@/types/membership";

type Props = {
    membership: MembershipView;
    reload: () => void;
};

export default function MembershipLifecycleActions({
    membership,
    reload,
}: Props) {
    const { show } = useSnackbar();

    const [confirm, setConfirm] = useState<{
        open: boolean;
        action: null | "approve" | "reject" | "revoke";
    }>({ open: false, action: null });

    function open(action: "approve" | "reject" | "revoke") {
        setConfirm({ open: true, action });
    }

    function close() {
        setConfirm({ open: false, action: null });
    }

    async function executeAction() {
        try {
            if (confirm.action === "approve") {
                await approveMembership(membership.membershipId);
                show("Approved");
            }
            if (confirm.action === "reject") {
                await rejectMembership(membership.membershipId);
                show("Rejected");
            }
            if (confirm.action === "revoke") {
                await revokeMembership(membership.membershipId);
                show("Revoked");
            }

            reload();
        } catch (err: unknown) {
            if (err instanceof Error) {
                show(err.message, "error");
            } else {
                show("Action failed", "error");
            }
        } finally {
            close();
        }
    }

    return (
        <>
            <Stack direction="row" spacing={2}>
                {membership.status === "PENDING" && (
                    <>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => open("approve")}>
                            Approve
                        </Button>

                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => open("reject")}
                        >
                            Reject
                        </Button>
                    </>
                )}

                {membership.status === "APPROVED" && (
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => open("revoke")}
                    >
                        Revoke
                    </Button>
                )}
            </Stack>

            <Dialog open={confirm.open} onClose={close}>
                <DialogTitle>
                    Confirm {confirm.action}
                </DialogTitle>

                <DialogContent>
                    Are you sure you want to {confirm.action} this membership?
                </DialogContent>

                <DialogActions>
                    <Button onClick={close}>Cancel</Button>
                    <Button color="error" onClick={executeAction}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}