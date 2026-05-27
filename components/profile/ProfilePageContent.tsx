"use client";

import { useEffect, useState } from "react";

import {
    Container,
    Paper,
    Typography,
    Divider,
    Stack,
    CircularProgress,
} from "@mui/material";

import ProfileForm from "./ProfileForm";
import UserMembershipSelector from "@/components/memberships/UserMembershipSelector";
import MembershipRequestForm from "@/components/memberships/MembershipRequestForm";

import { fetchProfile } from "@/lib/api/profiles";
import { ProfileDTO } from "@/types/profile";

export default function ProfilePageContent() {

    const [profile, setProfile] = useState<ProfileDTO | null>(null);
    const [loading, setLoading] = useState(true);

    async function load() {
        try {
            setLoading(true);
            const res = await fetchProfile();
            setProfile(res.profile);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Stack spacing={4}>

                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6">
                        Profile
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <ProfileForm
                        profile={profile}
                        onSaved={(profile) => {
                            setProfile(profile);
                        }}
                    />
                </Paper>

                {profile ? (
                    <>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6">
                                Memberships
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            <UserMembershipSelector />
                        </Paper>

                        <Paper sx={{ p: 3 }}>
                            <MembershipRequestForm />
                        </Paper>
                    </>
                ) : (
                    <Paper sx={{ p: 3 }}>
                        <Typography color="text.secondary">
                            Complete your profile to access memberships.
                        </Typography>
                    </Paper>
                )}
            </Stack>
        </Container>
    );
}