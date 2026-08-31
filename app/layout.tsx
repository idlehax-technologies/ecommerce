import type { Metadata } from "next";
import ThemeRegistry from "./theme/ThemeRegistry";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { SnackbarProvider } from "@/contexts/SnackbarContext";
// import { startJobLoop } from "@/lib/jobs/loop";

// startJobLoop();

export const metadata: Metadata = {
  title: "everyShop",
  description: "Shopping made simple",
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