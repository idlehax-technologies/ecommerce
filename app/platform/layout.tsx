import { Box } from "@mui/material";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import PlatformGuard from "@/components/guards/PlatformGuard";

export default function PlatformLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <PlatformGuard>
            <Navbar />

            <Box sx={{ display: "flex", flex: 1 }}>
                <Sidebar />

                <Box sx={{ flex: 1 }}>
                    {children}
                </Box>
            </Box>
        </PlatformGuard>
    );
}