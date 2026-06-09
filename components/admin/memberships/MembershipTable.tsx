"use client";

import { useRouter }
    from "next/navigation";

import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from "@mui/material";

import type { MembershipView }
    from "@/types/membership";

import MembershipStatusBadge
    from "@/components/memberships/MembershipStatusBadge";

import MembershipRoleActions
    from "@/components/admin/memberships/MembershipRoleActions";

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
                    <TableCell>Tenant</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell align="right">
                        Actions
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
                            {m.tenant.name}
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
                            <MembershipRoleActions
                                membership={m}
                                reload={() => {
                                    router.refresh();
                                }}
                            />
                        </TableCell>

                    </TableRow>

                ))}

            </TableBody>

        </Table>
    );
}