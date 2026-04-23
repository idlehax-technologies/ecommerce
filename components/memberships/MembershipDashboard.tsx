"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Stack,
    TextField,
    ToggleButtonGroup,
    ToggleButton,
    Typography,
} from "@mui/material";

import { fetchMemberships } from "@/lib/api/memberships";
import MembershipSection from "./MembershipSection";
import { MembershipView } from "@/types/membership";

const STATUSES = ["ALL", "PENDING", "APPROVED", "REJECTED", "REVOKED", "EXPIRED"] as const;

export default function MembershipDashboard() {
    const [data, setData] = useState<MembershipView[]>([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<typeof STATUSES[number]>("ALL");

    async function load() {
        const res = await fetchMemberships();
        setData(res);
    }

    useEffect(() => {
        load();
    }, []);

    const filtered = useMemo(() => {
        return data
            .filter((m) => {
                if (statusFilter !== "ALL" && m.status !== statusFilter) {
                    return false;
                }

                const q = search.toLowerCase();

                return (
                    m.user.fullName.toLowerCase().includes(q) ||
                    m.user.phone.includes(q) ||
                    m.user.email.toLowerCase().includes(q)
                );
            })
            .sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
    }, [data, search, statusFilter]);

    const grouped = {
        PENDING: filtered.filter((m) => m.status === "PENDING"),
        APPROVED: filtered.filter((m) => m.status === "APPROVED"),
        REJECTED: filtered.filter((m) => m.status === "REJECTED"),
        REVOKED: filtered.filter((m) => m.status === "REVOKED"),
        EXPIRED: filtered.filter((m) => m.status === "EXPIRED"),
    };

    return (
        <Stack spacing={3}>
            {/* SEARCH */}
            <TextField
                label="Search (name / phone / email)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
            />

            {/* FILTER */}
            <ToggleButtonGroup
                value={statusFilter}
                exclusive
                onChange={(_, val) => val && setStatusFilter(val)}
                size="small"
            >
                {STATUSES.map((s) => (
                    <ToggleButton key={s} value={s}>
                        {s}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>

            {/* SECTIONS */}
            {Object.entries(grouped).map(([status, list]) =>
                list.length ? (
                    <MembershipSection
                        key={status}
                        title={`${status} (${list.length})`}
                        data={list}
                    />
                ) : null
            )}

            {/* EMPTY STATE */}
            {filtered.length === 0 && (
                <Typography color="text.secondary">
                    No memberships found.
                </Typography>
            )}
        </Stack>
    );
}