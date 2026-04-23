"use client";

import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
} from "@mui/material";
import { useRouter } from "next/navigation";
import MembershipStatusBadge from "./MembershipStatusBadge";
import { MembershipView } from "@/types/membership";

export default function MembershipTable({
    data,
}: {
    data: MembershipView[];
}) {
    const router = useRouter();

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Tenant</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell />
                </TableRow>
            </TableHead>

            <TableBody>
                {data.map((m) => (
                    <TableRow key={m.membershipId}>
                        <TableCell>{m.user.fullName || "-"}</TableCell>
                        <TableCell>{m.user.phone || "-"}</TableCell>
                        <TableCell>{m.user.email || "-"}</TableCell>
                        <TableCell>{m.tenant.name || "-"}</TableCell>
                        <TableCell>
                            <MembershipStatusBadge status={m.status} />
                        </TableCell>
                        <TableCell>
                            <Button
                                onClick={() =>
                                    router.push(
                                        `/memberships/${m.membershipId}`
                                    )
                                }
                            >
                                View Details
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}