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

export default function ProfilePageLayout() {
    const [hasProfile, setHasProfile] = useState<boolean | null>(null);

    useEffect(() => {
        fetchProfile().then((p) => {
            setHasProfile(!!p);
        });
    }, []);

    if (hasProfile === null) {
        return <CircularProgress />;
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Stack spacing={4}>
                {/* PROFILE */}
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6">Profile</Typography>
                    <Divider sx={{ my: 2 }} />
                    <ProfileForm
                        onSaved={async () => {
                            const p = await fetchProfile();
                            setHasProfile(!!p);
                        }}
                    />
                </Paper>

                {/* MEMBERSHIP SECTION */}
                {hasProfile ? (
                    <>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6">Memberships</Typography>
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