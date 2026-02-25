import type { Metadata } from "next";
import CustomStyles from "./theme";

import Footer from "@/components/Footer";

import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "SchoolMart",
  description: "School based ecommerce system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CustomStyles>
          <AuthProvider>

            {/* main grows, footer sticks to bottom */}
            <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              {children}
            </main>

            <Footer />
          </AuthProvider>
        </CustomStyles>
      </body>
    </html>
  );
}
