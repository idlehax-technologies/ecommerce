"use client";

import { useEffect, useState } from "react";
import {
    TextField,
    Button,
    Stack,
    CircularProgress,
} from "@mui/material";

import { fetchProfile, saveProfile } from "@/lib/api/profiles";
import { useSnackbar } from "@/components/common/AppSnackbar";

export default function ProfileForm({
    onSaved,
}: {
    onSaved?: () => void;
}) {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        addressText: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const { show } = useSnackbar();

    useEffect(() => {
        fetchProfile()
            .then((p) => {
                if (p) setForm(p);
            })
            .finally(() => setLoading(false));
    }, []);

    function isComplete() {
        return (
            form.fullName.trim() &&
            form.email.trim() &&
            form.addressText.trim()
        );
    }

    async function submit() {
        try {
            setSaving(true);
            await saveProfile(form);
            show("Profile saved");
            onSaved?.(); // 🔴 trigger refresh
        } catch {
            show("Save failed", "error");
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <CircularProgress />;

    return (
        <Stack spacing={2}>
            <TextField
                label="Full Name"
                value={form.fullName}
                onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                }
            />

            <TextField
                label="Email"
                value={form.email}
                onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                }
            />

            <TextField
                label="Address"
                value={form.addressText}
                onChange={(e) =>
                    setForm({ ...form, addressText: e.target.value })
                }
            />

            <Button
                variant="contained"
                disabled={!isComplete() || saving}
                onClick={submit}
            >
                {saving ? "Saving..." : "Save Profile"}
            </Button>
        </Stack>
    );
}