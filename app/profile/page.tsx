"use client";

import { useEffect, useState } from "react";
import { Container } from "@mui/material";
import ProfileForm from "@/components/profile/ProfileForm";
import MembershipRequestSection from "@/components/profile/MembershipRequestSection";
import MembershipStatusCard from "@/components/profile/MembershipStatusCard";
import { myMemberships } from "@/lib/api/memberships";

export default function Page() {
    const [memberships, setMemberships] = useState<any[]>([]);

    useEffect(() => {
        myMemberships().then(setMemberships);
    }, []);

    const saveProfile = async (data: any) => {
        console.log("save profile", data);
    };

    return (
        <Container maxWidth="sm">
            <ProfileForm onSave={saveProfile} />

            <MembershipRequestSection tenants={[]} disabled={false} />

            <MembershipStatusCard memberships={memberships} />
        </Container>
    );
}
