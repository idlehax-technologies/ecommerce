import type { Metadata } from "next";
import CustomStyles from "./theme";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

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
            <CartProvider>
              <Navbar />

              {/* main grows, footer sticks to bottom */}
              <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {children}
              </main>

              <Footer />
            </CartProvider>
          </AuthProvider>
        </CustomStyles>
      </body>
    </html>
  );
}
