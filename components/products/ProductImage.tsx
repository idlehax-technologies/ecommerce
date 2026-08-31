"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    Box,
    CardMedia,
} from "@mui/material";

type Props = {
    src?: string;
    alt: string;
    aspectRatio?: string;
};

export default function ProductImage({
    src,
    alt,
    aspectRatio = "4 / 3",
}: Props) {

    const [loaded, setLoaded] =
        useState(false);

    useEffect(() => {

        setLoaded(false);

        if (!src) {
            return;
        }

        let cancelled = false;

        const image = new Image();

        image.onload = () => {

            if (!cancelled) {
                setLoaded(true);
            }

        };

        image.onerror = () => {

            if (!cancelled) {
                setLoaded(false);
            }

        };

        image.src = src;

        return () => {
            cancelled = true;
        };

    }, [src]);

    if (!loaded) {
        return (
            <Box
                sx={{
                    aspectRatio,
                    bgcolor: "grey.100",
                }}
            />
        );
    }

    return (
        <CardMedia
            component="img"
            image={src}
            alt={alt}
            onError={() =>
                setLoaded(false)
            }
            sx={{
                aspectRatio,
                objectFit: "cover",
            }}
        />
    );
}