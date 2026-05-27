"use client";

import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
} from "@mui/material";

import ExpandMoreIcon
    from "@mui/icons-material/ExpandMore";

import type { MembershipView }
    from "@/types/membership";

import MembershipTable
    from "./MembershipTable";

type Props = {
    title: string;
    data: MembershipView[];
};

export default function MembershipSection({
    title,
    data,
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
                <MembershipTable data={data} />
            </AccordionDetails>

        </Accordion>
    );
}