"use client";

import {
    Paper,
    Stack,
    Typography,
} from "@mui/material";

type Props = {
    title: string;
    value: string | number;
};

export default function MetricCard({
    title,
    value,
}: Props) {

    return (
        <Paper
            variant="outlined"
            sx={{ p: 2, height: "100%" }}
        >
            <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                    {title}
                </Typography>

                <Typography variant="h5" fontWeight={600}>
                    {value}
                </Typography>
            </Stack>
        </Paper>
    );
}