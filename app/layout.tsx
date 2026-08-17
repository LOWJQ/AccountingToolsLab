import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { CurrencyProvider } from "@/components/currency/CurrencyProvider";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { siteConfig } from "@/lib/seo/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["600", "700", "800", "900"],
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "AccountingToolsLab",
  description: "Free accounting tools and guides for learners and small businesses.",
  alternates: {
    canonical: `${siteConfig.url}/`
  },
  openGraph: {
    title: "AccountingToolsLab",
    description: "Free accounting tools and guides for learners and small businesses.",
    url: `${siteConfig.url}/`,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: siteConfig.ogImage.url,
        width: siteConfig.ogImage.width,
        height: siteConfig.ogImage.height,
        alt: siteConfig.ogImage.alt
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "AccountingToolsLab",
    description: "Free accounting tools and guides for learners and small businesses.",
    images: [siteConfig.ogImage.url]
  },
  icons: {
    icon: [
      {
        url: "/google-favicon.png",
        sizes: "512x512",
        type: "image/png"
      },
      {
        url: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon"
      }
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
    <html lang="en-MY" className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>
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
