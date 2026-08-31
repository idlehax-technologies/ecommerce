"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
    Stack,
    TextField,
    Button,
    MenuItem,
} from "@mui/material";

import {
    createTenant,
    updateTenant,
} from "@/lib/api/tenants";

import {
    INDIAN_STATES,
    type IndianState,
} from "@/lib/tenants/states";

import { useSnackbar } from "@/contexts/SnackbarContext";

import type { Tenant } from "@/types/tenant";

type TenantFormValues = {
    name: string;
    address: string;
    state: IndianState | "";
    gstin: string;
};

type Props =
    | {
        mode: "create";
    }
    | {
        mode: "edit";
        tenant: Tenant;
    };

export default function TenantForm(props: Props) {
    const router = useRouter();

    const { show } = useSnackbar();

    const [loading, setLoading] = useState(false);

    const tenant =
        props.mode === "edit"
            ? props.tenant
            : null;

    const [values, setValues] =
        useState<TenantFormValues>({
            name: tenant?.name ?? "",
            address: tenant?.address ?? "",
            state: tenant?.state ?? "",
            gstin: tenant?.gstin ?? "",
        });

    async function submit() {
        if (!values.state) {
            show("State is required", "error");
            return;
        }

        const payload = {
            ...values,
            state: values.state,
        };

        try {
            setLoading(true);

            if (props.mode === "create") {
                const { tenant } = await createTenant(payload);
                router.push(`/platform/tenants/${tenant.tenantId}`);

            } else {
                await updateTenant(props.tenant.tenantId, payload);
                router.refresh();
            }

        } catch (err: unknown) {
            if (err instanceof Error) {
                show(err.message, "error");
            } else {
                show("Failed to save tenant", "error");
            }

        } finally {
            setLoading(false);
        }
    }

    return (
        <Stack spacing={2}>
            <TextField
                label="Name"
                required
                value={values.name}
                onChange={(e) =>
                    setValues({ ...values, name: e.target.value })
                }
            />

            <TextField
                label="Address"
                required
                multiline
                minRows={3}
                value={values.address}
                onChange={(e) =>
                    setValues({ ...values, address: e.target.value })
                }
            />

            <TextField
                select
                label="State"
                required
                value={values.state}
                onChange={(e) =>
                    setValues({
                        ...values,
                        state: e.target.value as TenantFormValues["state"],
                    })
                }
            >
                <MenuItem value="">
                    Select State
                </MenuItem>
                {INDIAN_STATES.map(
                    (state) => (
                        <MenuItem
                            key={state.code}
                            value={state.name}
                        >
                            {state.name}
                        </MenuItem>
                    )
                )}
            </TextField>

            <TextField
                label="GSTIN"
                value={values.gstin}
                onChange={(e) =>
                    setValues({ ...values, gstin: e.target.value })
                }
            />

            <Button
                variant="contained"
                disabled={loading}
                onClick={submit}
            >
                {loading
                    ? props.mode === "create"
                        ? "Creating Tenant..."
                        : "Saving Changes..."
                    : props.mode === "create"
                        ? "Create Tenant"
                        : "Save Changes"}
            </Button>
        </Stack>
    );
}