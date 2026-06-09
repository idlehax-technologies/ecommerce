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
    tenantId: string;
    rows: TenantProvisioningRow[];
    onRowChange(
        productId: string,
        patch: Partial<TenantProvisioningRow>
    ): void;
};

export default function TenantInventorySection({
    title,
    tenantId,
    rows,
    onRowChange,
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
                    tenantId={tenantId}
                    rows={rows}
                    onRowChange={onRowChange}
                />
            </AccordionDetails>

        </Accordion>
    );
}