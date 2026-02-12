"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
import RoleGuard from "@/components/RoleGuard";

type Tenant = {
    tenantId: string;
    name: string;
    status: "created" | "active" | "inactive";
};

export default function TenantsPage() {
    const [tenants, setTenants] = useState<Tenant[] | null>(null);
    const router = useRouter();

    useEffect(() => {
        tenantAdminApi.list().then(setTenants);
    }, []);

    const assume = async (id: string) => {
        await fetch(`/api/admin/tenants/${id}/assume`, { method: "POST" });
        router.push("/");
    };

    if (!tenants) {
        return (
            <Container sx={{ py: 6 }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <RoleGuard allow={["superadmin"]}>
            <Container maxWidth="md" sx={{ py: 6 }}>
                <Stack spacing={3}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h4">Tenants</Typography>

                        <Button
                            variant="contained"
                            onClick={() => router.push("/admin/tenants/new")}
                        >
                            New Tenant
                        </Button>
                    </Stack>

                    {tenants.map((t) => (
                        <Card key={t.tenantId}>
                            <CardContent>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Stack>
                                        <Typography variant="h6">{t.name}</Typography>
                                        <Chip
                                            size="small"
                                            label={t.status}
                                            color={
                                                t.status === "active"
                                                    ? "success"
                                                    : t.status === "inactive"
                                                        ? "error"
                                                        : "default"
                                            }
                                            sx={{ width: "fit-content", mt: 1 }}
                                        />
                                    </Stack>

                                    <Stack direction="row" spacing={1}>
                                        <Button
                                            variant="outlined"
                                            onClick={() =>
                                                router.push(`/admin/tenants/${t.tenantId}`)
                                            }
                                        >
                                            Manage
                                        </Button>

                                        <Button
                                            variant="contained"
                                            onClick={() => assume(t.tenantId)}
                                        >
                                            Assume
                                        </Button>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            </Container>
        </RoleGuard>
    );
}
