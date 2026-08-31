"use client";

import { useRouter }
    from "next/navigation";

import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
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
        <TableContainer>
            <Table
                sx={{
                    tableLayout: "fixed",
                    width: "100%",
                }}
            >
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ width: "14%" }}>
                            Name
                        </TableCell>
                        <TableCell sx={{ width: "10%" }}>
                            Phone
                        </TableCell>
                        <TableCell sx={{ width: "20%" }}>
                            Email
                        </TableCell>
                        <TableCell sx={{ width: "24%" }}>
                            Tenant
                        </TableCell>
                        <TableCell sx={{ width: "10%" }}>
                            Status
                        </TableCell>
                        <TableCell sx={{ width: "8%" }}>
                            Role
                        </TableCell>
                        <TableCell sx={{ width: "14%" }}>
                            Update Role
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

                            <TableCell>
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
        </TableContainer>
    );
}