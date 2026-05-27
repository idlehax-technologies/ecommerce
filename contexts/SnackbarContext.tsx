"use client";

import { Snackbar, Alert, AlertColor } from "@mui/material";
import { createContext, useCallback, useContext, useState } from "react";

type SnackbarState = {
    message: string;
    severity: AlertColor;
};

const SnackbarContext = createContext<{
    show: (msg: string, severity?: SnackbarState["severity"]) => void;
} | null>(null);

export function useSnackbar() {
    const c = useContext(SnackbarContext);
    if (!c) throw new Error("Snackbar not provided");
    return c;
}

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
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
            <Snackbar
                open={!!state}
                autoHideDuration={3000}
                onClose={close}
            >
                <Alert
                    severity={state?.severity || "success"}
                    onClose={close}
                >
                    {state?.message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
}