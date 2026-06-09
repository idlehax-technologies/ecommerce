"use client";

import {
    Stack,
    Button,
} from "@mui/material";

import type { Tenant } from "@/types/tenant";

type Props = {
    tenant: Tenant;

    activate: () => Promise<void>;
    suspend: () => Promise<void>;
    archive: () => Promise<void>;
    assume: () => Promise<void>;
};

export default function TenantLifecycleActions({
    tenant,
    activate,
    suspend,
    archive,
    assume,
}: Props) {

    return (
        <Stack
            direction="row"
            spacing={2}
        >

            {(tenant.status === "PENDING" ||
                tenant.status === "SUSPENDED") && (
                    <form action={activate}>
                        <Button
                            type="submit"
                            variant="contained"
                        >
                            Activate
                        </Button>
                    </form>
                )}

            {tenant.status === "ACTIVE" && (
                <form action={suspend}>
                    <Button
                        type="submit"
                        color="warning"
                        variant="contained"
                    >
                        Suspend
                    </Button>
                </form>
            )}

            {tenant.status !== "ARCHIVED" && (
                <form action={archive}>
                    <Button
                        type="submit"
                        color="error"
                        variant="outlined"
                    >
                        Archive
                    </Button>
                </form>
            )}

            <form action={assume}>
                <Button
                    type="submit"
                    variant="outlined"
                >
                    Assume as Admin
                </Button>
            </form>

        </Stack>
    );
}