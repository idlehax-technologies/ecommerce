"use client";

import Link from "next/link";

import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Button,
} from "@mui/material";

import type { MembershipView }
    from "@/types/membership";

import MembershipStatusBadge
    from "./MembershipStatusBadge";

type Props = {
    data: MembershipView[];
};

export default function MembershipTable({
    data,
}: Props) {

    return (
        <TableContainer>
            <Table
                sx={{
                    tableLayout: "fixed",
                    width: "100%",
                }}
            >
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ width: "20%" }}>
                            Name
                        </TableCell>
                        <TableCell sx={{ width: "14%" }}>
                            Phone
                        </TableCell>
                        <TableCell sx={{ width: "28%" }}>
                            Email
                        </TableCell>
                        <TableCell sx={{ width: "14%" }}>
                            Status
                        </TableCell>
                        <TableCell sx={{ width: "10%" }}>
                            Role
                        </TableCell>
                        <TableCell align="center" sx={{ width: "14%" }}>
                            Details
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {data.map((m) => (
                        <TableRow key={m.membershipId}>
                            <TableCell>
                                {m.user.fullName}
                            </TableCell>

                            <TableCell>
                                {m.user.phone}
                            </TableCell>

                            <TableCell>
                                {m.user.email}
                            </TableCell>

                            <TableCell>
                                <MembershipStatusBadge
                                    status={m.status}
                                />
                            </TableCell>

                            <TableCell>
                                {m.role}
                            </TableCell>

                            <TableCell align="center">
                                <Button
                                    component={Link}
                                    href={`/memberships/${m.membershipId}`}
                                >
                                    View Details
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}