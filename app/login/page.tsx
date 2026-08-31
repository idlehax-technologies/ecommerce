import { Stack } from "@mui/material";

import Navbar from "@/components/layout/Navbar";
import PhoneLoginForm from "@/components/auth/PhoneLoginForm";

export default function LoginPage() {
    return (
        <>
            <Navbar />

            <Stack
                sx={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    px: {
                        xs: 2,
                        sm: 4,
                        md: 8,
                    },
                    py: {
                        xs: 2,
                        sm: 4,
                    },
                }}
            >
                <PhoneLoginForm />
            </Stack>
        </>
    );
}