"use client";

import { useEffect, useState } from "react";
import { Container, Typography } from "@mui/material";
import { pendingMemberships } from "@/lib/api/memberships";
import MembershipApprovalTable from "@/components/memberships/MembershipApprovalTable";

export default function Page() {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        pendingMemberships().then(setRows);
    }, []);

    return (
        <Container>
            <Typography variant="h5" mb={2}>
                Pending Approvals
            </Typography>

            <MembershipApprovalTable rows={rows} />
        </Container>
    );
}
