"use client";

import { Snackbar, Alert, AlertColor } from "@mui/material";
import { createContext, useCallback, useContext, useState } from "react";

type SnackbarState = {
    message: string;
    severity: AlertColor;
};

type SnackbarContextValue = {
    show: (
        message: string,
        severity?: AlertColor
    ) => void;
};

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export function SnackbarProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [state, setState] = useState<SnackbarState | null>(null);

    const show = useCallback((
        message: string,
        severity: SnackbarState["severity"] = "success"
    ) => {
        setState({ message, severity });
    }, []);

    function close() {
        setState(null);
    }

    return (
        <SnackbarContext.Provider value={{ show }}>
            {children}

            {state && (
                <Snackbar
                    open
                    autoHideDuration={3000}
                    onClose={close}
                >
                    <Alert
                        severity={state.severity}
                        onClose={close}
                    >
                        {state.message}
                    </Alert>
                </Snackbar>
            )}
        </SnackbarContext.Provider>
    );
}

export function useSnackbar() {
    const ctx = useContext(SnackbarContext);

    if (!ctx) {
        throw new Error(
            "useSnackbar must be used within SnackbarProvider"
        );
    }

    return ctx;
}