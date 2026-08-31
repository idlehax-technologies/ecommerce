"use client";

import { useEffect, useRef } from "react";
import { Stack, TextField } from "@mui/material";

type OtpInputProps = {
    value: string;
    length?: number;
    disabled?: boolean;
    autoFocus?: boolean;
    focusKey?: number;
    onChange: (value: string) => void;
    onComplete?: (value: string) => void;
};

export default function OtpInput({
    value,
    length = 6,
    disabled = false,
    autoFocus = true,
    focusKey = 0,
    onChange,
    onComplete,
}: OtpInputProps) {

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const digits = Array.from(
        { length },
        (_, index) => value[index] ?? "",
    );

    const focusInput = (index: number) => {
        const input = inputRefs.current[index];

        if (!input) {
            return;
        }

        input.focus();

        const end = input.value.length;

        input.setSelectionRange(end, end);
    };

    useEffect(() => {
        if (!autoFocus || disabled) {
            return;
        }

        focusInput(0);
    }, [autoFocus, disabled, focusKey]);

    const handleChange = (
        index: number,
        nextValue: string,
    ) => {
        const digit = nextValue
            .replace(/\D/g, "")
            .slice(-1);

        const next = [...digits];
        next[index] = digit;

        const code = next.join("");

        onChange(code);

        if (code.length === length) {
            onComplete?.(code);
        } else if (digit && index < length - 1) {
            focusInput(index + 1);
        }
    };

    const handleKeyDown = (
        index: number,
        event: React.KeyboardEvent<HTMLDivElement>,
    ) => {
        switch (event.key) {
            case "Backspace": {
                if (digits[index]) {
                    const next = [...digits];
                    next[index] = "";
                    onChange(next.join(""));
                } else if (index > 0) {
                    focusInput(index - 1);

                    const next = [...digits];
                    next[index - 1] = "";
                    onChange(next.join(""));
                }

                event.preventDefault();
                break;
            }

            case "ArrowLeft":
                if (index > 0) {
                    focusInput(index - 1);
                }
                event.preventDefault();
                break;

            case "ArrowRight":
                if (index < length - 1) {
                    focusInput(index + 1);
                }
                event.preventDefault();
                break;
        }
    };

    const handlePaste = (
        event: React.ClipboardEvent<HTMLDivElement>,
    ) => {
        event.preventDefault();

        const pasted = event.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, length);

        if (!pasted) {
            return;
        }

        onChange(pasted);

        if (pasted.length === length) {
            onComplete?.(pasted);
        } else {
            focusInput(pasted.length);
        }
    };

    return (
        <Stack
            direction="row"
            spacing={{
                xs: 1,
                sm: 2,
            }}
        >
            {digits.map((digit, index) => (
                <TextField
                    key={index}
                    value={digit}
                    disabled={disabled}
                    inputRef={(element) => {
                        inputRefs.current[index] = element;
                    }}
                    onChange={(event) =>
                        handleChange(
                            index,
                            event.target.value,
                        )
                    }
                    onKeyDown={(event) =>
                        handleKeyDown(
                            index,
                            event,
                        )
                    }
                    onPaste={handlePaste}
                    slotProps={{
                        htmlInput: {
                            autoComplete: "one-time-code",
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                            maxLength: 1,
                        },
                    }}
                    sx={{
                        flex: 1,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                        },
                        "& .MuiInputBase-input": {
                            textAlign: "center",
                            fontSize: "1.5rem",
                            fontWeight: 600,
                        },
                    }}
                />
            ))}
        </Stack>
    );
}