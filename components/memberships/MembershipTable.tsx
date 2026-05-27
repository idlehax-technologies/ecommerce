"use client";

import { useRouter }
    from "next/navigation";

import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
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

    const router = useRouter();

    return (
        <Table>

            <TableHead>

                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell align="right" />
                </TableRow>

            </TableHead>

            <TableBody>

                {data.map((m) => (

                    <TableRow key={m.membershipId}>

                        <TableCell>
                            {m.user.fullName || "-"}
                        </TableCell>

                        <TableCell>
                            {m.user.phone || "-"}
                        </TableCell>

                        <TableCell>
                            {m.user.email || "-"}
                        </TableCell>

                        <TableCell>

                            <MembershipStatusBadge
                                status={m.status}
                            />

                        </TableCell>

                        <TableCell>
                            {m.role}
                        </TableCell>

                        <TableCell align="right">
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