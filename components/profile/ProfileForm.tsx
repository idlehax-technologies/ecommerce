"use client";

import { useEffect, useState } from "react";

import {
    TextField,
    Button,
    Stack,
} from "@mui/material";

import { saveProfile } from "@/lib/api/profiles";
import { useSnackbar } from "@/contexts/SnackbarContext";

import type { ProfileDTO } from "@/types/profile";

export default function ProfileForm({
    profile,
    onSaved,
}: {
    profile: ProfileDTO | null;
    onSaved?: (profile: ProfileDTO) => void;
}) {
    const [form, setForm] = useState<ProfileDTO>({
        fullName: "",
        email: "",
        addressText: "",
    });

    const [saving, setSaving] = useState(false);

    const { show } = useSnackbar();

    useEffect(() => {
        if (!profile) {
            return;
        }
        setForm(profile);
    }, [profile]);

    function isComplete(): boolean {
        return !!(
            form.fullName.trim() &&
            form.email.trim() &&
            form.addressText.trim()
        );
    }

    async function submit() {
        try {
            setSaving(true);
            const res = await saveProfile(form);
            show("Profile saved");
            onSaved?.(res.profile);
        } catch (err: unknown) {
            if (err instanceof Error) {
                show(err.message, "error");
            } else {
                show("Save failed", "error");
            }
        } finally {
            setSaving(false);
        }
    }

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
                multiline
                minRows={3}
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