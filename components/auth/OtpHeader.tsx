"use client";

import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

type OtpHeaderProps = {
    onBack: () => void;
};

export default function OtpHeader({
    onBack,
}: OtpHeaderProps) {
    return (
        <IconButton
            onClick={onBack}
            aria-label="Go back"
            edge="start"
        >
            <ArrowBackIcon />
        </IconButton>
    );
}