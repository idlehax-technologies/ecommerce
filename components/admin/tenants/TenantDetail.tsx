"use client";

import {
    Stack,
    Paper,
    Typography,
    Divider,
} from "@mui/material";

import type { Tenant } from "@/types/tenant";

import TenantStatusBadge from "./TenantStatusBadge";
import TenantLifecycleActions from "./TenantLifecycleActions";
import TenantForm from "./TenantForm";

type Props = {
    tenant: Tenant;

    activate: () => Promise<void>;
    suspend: () => Promise<void>;
    archive: () => Promise<void>;
};

export default function TenantDetail({
    tenant,
    activate,
    suspend,
    archive,
}: Props) {

    return (
        <Paper elevation={2} sx={{ p: 2 }}>
            <Stack spacing={2}>
                <Typography variant="h5" fontWeight={600}>
                    {tenant.name}
                </Typography>

                <Divider />

                <Stack direction="row" alignItems="center" spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography>
                            <strong>Status:</strong>
                        </Typography>
                        <TenantStatusBadge status={tenant.status} />
                    </Stack>

                    <Typography>
                        <strong>GSTIN:</strong>{" "}
                        {tenant.gstin
                            ? tenant.gstin
                            : "Non-GST"}
                    </Typography>
                </Stack>

                <Divider />

                <TenantForm
                    mode="edit"
                    tenant={tenant}
                />

                <Divider />

                <TenantLifecycleActions
                    tenant={tenant}
                    activate={activate}
                    suspend={suspend}
                    archive={archive}
                />
            </Stack>
        </Paper>
    );
}