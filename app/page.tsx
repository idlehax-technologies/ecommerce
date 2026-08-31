import { Stack } from "@mui/material";

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/public/Hero";
import CategoryMarquee from "@/components/public/CategoryMarquee";
import FeatureCards from "@/components/public/FeatureCards";

import PublicGuard from "@/components/guards/PublicGuard";

export default function LandingPage() {
    return (
        <PublicGuard>
            <Navbar />

            <Stack
                sx={{
                    px: {
                        xs: 2,
                        sm: 4,
                        md: 8,
                        lg: 16,
                    },
                    py: {
                        xs: 2,
                        sm: 4,
                    },
                }}
            >
                <Hero />

                <CategoryMarquee />

                <FeatureCards />
            </Stack>
        </PublicGuard>
    );
}