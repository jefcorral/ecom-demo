import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "Ecom Store",
    template: "%s | Ecom Store",
  },
  description: "A modern ecommerce storefront powered by Next.js, TypeScript, and Tailwind CSS.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ecom-store.vercel.app",
    siteName: "Ecom Store",
    title: {
      default: "Ecom Store",
      template: "%s | Ecom Store",
    },
    description: "A modern ecommerce storefront powered by Next.js, TypeScript, and Tailwind CSS.",
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: "Ecom Store",
      template: "%s | Ecom Store",
    },
    description: "A modern ecommerce storefront powered by Next.js, TypeScript, and Tailwind CSS.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", geist.variable)}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
