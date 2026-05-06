import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { CurrencyProvider } from "@/components/currency/CurrencyProvider";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { siteConfig } from "@/lib/seo/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "AccountingToolsLab",
  description: "Free accounting tools and guides for learners and small businesses.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" }
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CurrencyProvider>
          <Header />
          {children}
          <Footer />
        </CurrencyProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
