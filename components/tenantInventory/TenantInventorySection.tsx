"use client";

import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
} from "@mui/material";

import ExpandMoreIcon
    from "@mui/icons-material/ExpandMore";

import type {
    TenantProvisioningRow,
} from "@/lib/mappers/tenantProvisioningView";

import TenantInventoryTable
    from "./TenantInventoryTable";

type Props = {
    title: string;
    rows: TenantProvisioningRow[];
};

export default function TenantInventorySection({
    title,
    rows,
}: Props) {

    return (
        <Accordion defaultExpanded>

            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
            >
                <Typography variant="h6">
                    {title}
                </Typography>
            </AccordionSummary>

            <AccordionDetails>
                <TenantInventoryTable
                    rows={rows}
                />
            </AccordionDetails>

        </Accordion>
    );
}