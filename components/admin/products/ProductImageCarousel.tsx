"use client";

import { useState } from "react";

import {
    Box,
    Stack,
    IconButton,
} from "@mui/material";

import ChevronLeftIcon
    from "@mui/icons-material/ChevronLeft";

import ChevronRightIcon
    from "@mui/icons-material/ChevronRight";

type Props = {
    images: string[];
};

export default function ProductImageCarousel({
    images,
}: Props) {

    const [index, setIndex] =
        useState(0);

    if (images.length === 0) {
        return null;
    }

    function previous() {
        setIndex((i) =>
            i === 0
                ? images.length - 1
                : i - 1
        );
    }

    function next() {
        setIndex((i) =>
            i === images.length - 1
                ? 0
                : i + 1
        );
    }

    return (
        <Stack
            spacing={2}
            mb={3}
        >

            <Box
                sx={{
                    position: "relative",
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "divider",
                }}
            >

                <Box
                    component="img"
                    src={images[index]}
                    alt={`Product image ${index + 1}`}
                    sx={{
                        width: "100%",
                        height: 320,
                        objectFit: "cover",
                        display: "block",
                    }}
                />

                {images.length > 1 && (
                    <>

                        <IconButton
                            onClick={previous}
                            sx={{
                                position: "absolute",
                                top: "50%",
                                left: 8,
                                transform:
                                    "translateY(-50%)",
                                bgcolor:
                                    "background.paper",
                            }}
                        >
                            <ChevronLeftIcon />
                        </IconButton>

                        <IconButton
                            onClick={next}
                            sx={{
                                position: "absolute",
                                top: "50%",
                                right: 8,
                                transform:
                                    "translateY(-50%)",
                                bgcolor:
                                    "background.paper",
                            }}
                        >
                            <ChevronRightIcon />
                        </IconButton>

                    </>
                )}

            </Box>

        </Stack>
    );
}