import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: {
    default: "Bloom & Stem",
    template: "%s | Bloom & Stem",
  },
  description: "Artisanal florals for life's most beautiful moments. Hand-tied bouquets, plants, and gifts delivered with care.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bloomandstem.example.com",
    siteName: "Bloom & Stem",
    title: {
      default: "Bloom & Stem",
      template: "%s | Bloom & Stem",
    },
    description: "Artisanal florals for life's most beautiful moments. Hand-tied bouquets, plants, and gifts delivered with care.",
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: "Bloom & Stem",
      template: "%s | Bloom & Stem",
    },
    description: "Artisanal florals for life's most beautiful moments. Hand-tied bouquets, plants, and gifts delivered with care.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={cn("min-h-screen bg-background font-sans antialiased", inter.variable, playfair.variable)}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1 pb-16 md:pb-0">{children}</main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
