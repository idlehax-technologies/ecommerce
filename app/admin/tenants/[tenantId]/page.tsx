"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
    Container,
    Stack,
    Card,
    CardContent,
    Typography,
    Button,
    Chip,
    CircularProgress,
} from "@mui/material";

import { tenantAdminApi } from "@/lib/api/tenantManagement";

type Tenant = {
    tenantId: string;
    name: string;
    status: "created" | "active" | "inactive";
};

export default function TenantDetailPage() {
    const { tenantId } = useParams<{ tenantId: string }>();
    const [tenant, setTenant] = useState<Tenant | null>(null);
    const router = useRouter();

    const load = () => {
        tenantAdminApi.get(tenantId).then(setTenant);
    };

    useEffect(() => {
        load();
    }, []);

    const activate = async () => {
        await tenantAdminApi.activate(tenantId);
        load();
    };

    const deactivate = async () => {
        await tenantAdminApi.deactivate(tenantId);
        load();
    };

    const assume = async () => {
        await fetch(`/api/admin/tenants/${tenantId}/assume`, { method: "POST" });
        router.push("/");
    };

    if (!tenant) {
        return (
            <Container sx={{ py: 6 }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ py: 6 }}>
            <Card>
                <CardContent>
                    <Stack spacing={3}>
                        <Typography variant="h5">{tenant.name}</Typography>

                        <Chip
                            label={tenant.status}
                            color={
                                tenant.status === "active"
                                    ? "success"
                                    : tenant.status === "inactive"
                                        ? "error"
                                        : "default"
                            }
                            sx={{ width: "fit-content" }}
                        />

                        <Stack direction="row" spacing={2}>
                            {tenant.status !== "active" && (
                                <Button variant="contained" onClick={activate}>
                                    Activate
                                </Button>
                            )}

                            {tenant.status === "active" && (
                                <Button color="error" variant="contained" onClick={deactivate}>
                                    Deactivate
                                </Button>
                            )}

                            <Button variant="outlined" onClick={assume}>
                                Assume as Admin
                            </Button>
                        </Stack>

                        <Button onClick={() => router.push("/admin/tenants")}>
                            Back
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    );
}
