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
      <body
        suppressHydrationWarning
        className={cn(
          "bg-surface font-body-md text-on-surface selection:bg-primary-container selection:text-on-primary-container",
          inter.variable,
          playfair.variable
        )}
      >
        <Providers>
          <SiteHeader />
          <main className="w-full min-h-screen pt-16 flex flex-col bg-surface">
            <div className="flex w-full flex-col">{children}</div>
          </main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
