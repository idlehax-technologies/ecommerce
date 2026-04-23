"use client";

import { Snackbar, Alert } from "@mui/material";
import { createContext, useContext, useState } from "react";

type SnackbarState = {
    message: string;
    severity: "success" | "error" | "info";
};

const Ctx = createContext<{
    show: (msg: string, severity?: SnackbarState["severity"]) => void;
} | null>(null);

export function useSnackbar() {
    const c = useContext(Ctx);
    if (!c) throw new Error("Snackbar not provided");
    return c;
}

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<SnackbarState | null>(null);

    function show(message: string, severity: SnackbarState["severity"] = "success") {
        setState({ message, severity });
    }

    return (
        <Ctx.Provider value={{ show }}>
            {children}
            <Snackbar
                open={!!state}
                autoHideDuration={3000}
                onClose={() => setState(null)}
            >
                <Alert severity={state?.severity || "success"}>
                    {state?.message}
                </Alert>
            </Snackbar>
        </Ctx.Provider>
    );
}