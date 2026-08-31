"use client";

import { useMemo, useState } from "react";

import {
    Stack,
    TextField,
    ToggleButtonGroup,
    ToggleButton,
    Typography,
} from "@mui/material";

import MembershipSection
    from "./MembershipSection";

import type { MembershipView }
    from "@/types/membership";

const SECTIONS = [
    "ALL",
    "PENDING",
    "APPROVED",
    "REJECTED",
    "REVOKED",
    "EXPIRED",
] as const;

type Props = {
    memberships: MembershipView[];
};

export default function MembershipsDashboard({
    memberships,
}: Props) {

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState<typeof SECTIONS[number]>("ALL");

    const filtered = useMemo(() => {

        const q =
            search.toLowerCase();

        return memberships
            .filter((m) => {
                if (
                    statusFilter !== "ALL" &&
                    m.status !== statusFilter
                ) {
                    return false;
                }

                return (
                    m.user.fullName
                        .toLowerCase()
                        .includes(q) ||

                    m.user.phone
                        .includes(q) ||

                    m.user.email
                        .toLowerCase()
                        .includes(q) ||

                    m.tenant.name
                        .toLowerCase()
                        .includes(q) ||

                    m.role
                        .toLowerCase()
                        .includes(q)
                );
            })
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            );

    }, [
        memberships,
        search,
        statusFilter,
    ]);

    const grouped = {
        PENDING:
            filtered.filter(
                (m) => m.status === "PENDING"
            ),

        APPROVED:
            filtered.filter(
                (m) => m.status === "APPROVED"
            ),

        REJECTED:
            filtered.filter(
                (m) => m.status === "REJECTED"
            ),

        REVOKED:
            filtered.filter(
                (m) => m.status === "REVOKED"
            ),

        EXPIRED:
            filtered.filter(
                (m) => m.status === "EXPIRED"
            ),
    };

    return (
        <Stack spacing={2}>

            <TextField
                label="Search memberships"
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
                fullWidth
            />

            <ToggleButtonGroup
                value={statusFilter}
                exclusive
                size="small"
                onChange={(_, val) => {
                    if (val) {
                        setStatusFilter(val);
                    }
                }}
            >

                {SECTIONS.map((status) => (
                    <ToggleButton
                        key={status}
                        value={status}
                    >
                        {status}
                    </ToggleButton>
                ))}

            </ToggleButtonGroup>

            {Object.entries(grouped).map(
                ([status, list]) =>
                    list.length ? (
                        <MembershipSection
                            key={status}
                            title={`${status} (${list.length})`}
                            data={list}
                        />
                    ) : null
            )}

            {filtered.length === 0 && (
                <Typography color="text.secondary">
                    No memberships found.
                </Typography>
            )}

        </Stack>
    );
}