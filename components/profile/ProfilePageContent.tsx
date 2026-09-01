"use client";

import { useEffect, useState } from "react";

import {
    Container,
    Box,
    Paper,
    Typography,
    Divider,
    Stack,
    CircularProgress,
} from "@mui/material";

import ProfileForm from "./ProfileForm";
import UserMembershipSelector
    from "@/components/memberships/UserMembershipSelector";
import MembershipRequestForm
    from "@/components/memberships/MembershipRequestForm";

import { useSnackbar } from "@/contexts/SnackbarContext";

import { fetchProfile } from "@/lib/api/profiles";
import { fetchMyMemberships } from "@/lib/api/memberships";

import type { ProfileDTO } from "@/types/profile";
import type { MembershipView } from "@/types/membership";

export default function ProfilePageContent() {
    const { show } = useSnackbar();

    const [profile, setProfile] = useState<ProfileDTO | null>(null);
    const [memberships, setMemberships] = useState<MembershipView[]>([]);

    const [loading, setLoading] = useState(true);
    const [membershipsLoading, setMembershipsLoading] = useState(true);

    async function load() {
        try {
            setLoading(true);
            const res = await fetchProfile();
            setProfile(res.profile);

            await loadMemberships();

        } catch (err: unknown) {
            if (err instanceof Error) {
                show(err.message, "error");
            } else {
                show("Failed to load profile", "error");
            }

        } finally {
            setLoading(false);
        }
    }

    async function loadMemberships() {
        try {
            setMembershipsLoading(true);
            const res = await fetchMyMemberships();
            setMemberships(res.memberships);

        } catch (err: unknown) {
            if (err instanceof Error) {
                show(err.message, "error");
            } else {
                show("Failed to load memberships", "error");
            }

        } finally {
            setMembershipsLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Container maxWidth="md">
            <Stack
                spacing={2}
                sx={{ p: { xs: 0, sm: 6 } }}
            >
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        Profile
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Manage your profile and memberships
                    </Typography>
                </Box>

                <Divider />

                <Paper elevation={2} sx={{ p: 2 }}>
                    <Stack spacing={2}>
                        <Paper elevation={2} sx={{ p: 2 }}>
                            <ProfileForm
                                profile={profile}
                                onSaved={(profile) => {
                                    setProfile(profile);
                                }}
                            />
                        </Paper>

                        {profile ? (
                            <>
                                <Paper elevation={2} sx={{ p: 2 }}>
                                    <UserMembershipSelector
                                        memberships={memberships}
                                        loading={membershipsLoading}
                                    />
                                </Paper>

                                <Paper elevation={2} sx={{ p: 2 }}>
                                    <MembershipRequestForm
                                        onRequested={loadMemberships}
                                    />
                                </Paper>
                            </>
                        ) : (
                            <Paper elevation={2} sx={{ p: 2 }}>
                                <Typography color="text.secondary">
                                    Complete your profile to access memberships
                                </Typography>
                            </Paper>
                        )}
                    </Stack>
                </Paper>
            </Stack>
        </Container>
    );
}