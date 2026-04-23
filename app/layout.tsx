// app/layout.tsx

import type { Metadata } from "next";
import ThemeRegistry from "./ThemeRegistry";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { SnackbarProvider } from "@/components/common/AppSnackbar";

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
        <ThemeRegistry>
          <AuthProvider>
            <SnackbarProvider>
              <main
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {children}
              </main>
            </SnackbarProvider>
            <Footer />
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}