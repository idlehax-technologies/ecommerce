"use client";

import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import MembershipTable from "./MembershipTable";
import { MembershipView } from "@/types/membership";

export default function MembershipSection({
    title,
    data,
}: {
    title: string;
    data: MembershipView[];
}) {
    return (
        <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{title}</Typography>
            </AccordionSummary>

            <AccordionDetails>
                <MembershipTable data={data} />
            </AccordionDetails>
        </Accordion>
    );
}