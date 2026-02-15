"use client";

import Link from "next/link";
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
} from "@mui/material";

export default function MembershipApprovalTable({ rows }: { rows: any[] }) {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Tenant</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell />
                </TableRow>
            </TableHead>

            <TableBody>
                {rows.map((r) => (
                    <TableRow key={r.membershipId}>
                        <TableCell>{r.userId}</TableCell>
                        <TableCell>{r.tenantId}</TableCell>
                        <TableCell>{r.status}</TableCell>
                        <TableCell>
                            <Button
                                component={Link}
                                href={`/admin/memberships/${r.membershipId}`}
                            >
                                Review
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
