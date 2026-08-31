"use client";

import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
} from "@mui/material";

import ExpandMoreIcon
    from "@mui/icons-material/ExpandMore";

import ProductTable
    from "./ProductTable";

import type { Product }
    from "@/types/product";

type Props = {
    title: string;
    data: Product[];
};

export default function ProductSection({
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
                <ProductTable
                    products={data}
                />
            </AccordionDetails>
        </Accordion>
    );
}