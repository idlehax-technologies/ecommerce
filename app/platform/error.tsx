"use client";

import {
    Container,
    Typography,
    Stack,
    Button,
    Paper,
} from "@mui/material";

type Props = {
    error: Error & {
        digest?: string;
    };
    reset: () => void;
};

export default function PlatformErrorPage({
    error,
    reset,
}: Props) {

    return (
        <Container
            maxWidth="sm"
            sx={{ py: 8 }}
        >
            <Paper sx={{ p: 4 }}>
                <Stack spacing={3}>
                    <Typography variant="h5">
                        Platform Error
                    </Typography>
                    <Typography
                        color="text.secondary"
                    >
                        {error.message ||
                            "Something went wrong."}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={reset}
                    >
                        Retry
                    </Button>
                </Stack>
            </Paper>
        </Container>
    );
}