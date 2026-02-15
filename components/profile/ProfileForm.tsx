"use client";

import { useState } from "react";
import { Box, TextField, Button, Stack } from "@mui/material";

type Props = {
    initial?: {
        fullName?: string;
        phone?: string;
        email?: string;
        address?: string;
        location?: string;
    };
    onSave: (data: any) => Promise<void>;
};

export default function ProfileForm({ initial, onSave }: Props) {
    const [form, setForm] = useState({
        fullName: initial?.fullName ?? "",
        phone: initial?.phone ?? "",
        email: initial?.email ?? "",
        address: initial?.address ?? "",
        location: initial?.location ?? "",
    });

    const [saving, setSaving] = useState(false);

    const handle = (k: string, v: string) =>
        setForm((p) => ({ ...p, [k]: v }));

    const submit = async () => {
        setSaving(true);
        await onSave(form);
        setSaving(false);
    };

    const complete =
        form.fullName &&
        form.phone &&
        form.email &&
        form.address &&
        form.location;

    return (
        <Box>
            <Stack spacing={2}>
                <TextField label="Full name" value={form.fullName} onChange={(e) => handle("fullName", e.target.value)} />
                <TextField label="Phone" value={form.phone} disabled />
                <TextField label="Email" value={form.email} onChange={(e) => handle("email", e.target.value)} />
                <TextField label="Address" value={form.address} onChange={(e) => handle("address", e.target.value)} />
                <TextField label="Location" value={form.location} onChange={(e) => handle("location", e.target.value)} />

                <Button
                    variant="contained"
                    onClick={submit}
                    disabled={!complete || saving}
                >
                    Save Profile
                </Button>
            </Stack>
        </Box>
    );
}
