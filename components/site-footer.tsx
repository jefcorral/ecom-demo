"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Clock3, Flower2, MapPin, Phone } from "lucide-react";
import { NewsletterSignup } from "@/components/footer/newsletter-signup";
import { TrustBar } from "@/components/footer/trust-bar";

const footerLinks = [
  { title: "Shop", links: [{ label: "Shop All", href: "/products" }, { label: "Best Sellers", href: "/products?sort=featured" }, { label: "New Arrivals", href: "/products?sort=newest" }, { label: "Same-Day", href: "/products?search=Same-Day" }, { label: "Plants", href: "/products?categoryId=plants" }, { label: "Gifts", href: "/products?categoryId=gifts" }] },
  { title: "Occasions", links: [{ label: "Birthday", href: "/products?search=Birthday" }, { label: "Romance", href: "/products?search=Romance" }, { label: "Sympathy", href: "/products?search=Sympathy" }, { label: "Just Because", href: "/products?search=Just%20Because" }, { label: "Weddings", href: "/products?search=Weddings" }, { label: "Corporate", href: "/products?search=Corporate" }] },
  { title: "Help", links: [{ label: "Delivery Info", href: "/help#delivery" }, { label: "Care Guide", href: "/help#care" }, { label: "Returns", href: "/help#returns" }, { label: "FAQ", href: "/help" }, { label: "Track Order", href: "/orders" }, { label: "Contact", href: "/contact" }] },
  { title: "Company", links: [{ label: "About Us", href: "/about" }, { label: "Our Florists", href: "/about#florists" }, { label: "Sustainability", href: "/about#sustainability" }, { label: "Careers", href: "/careers" }, { label: "Press", href: "/press" }] },
];

const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

export function SiteFooter() {
  const pathname = usePathname();
  if (authRoutes.includes(pathname)) return null;
  const showTrust = pathname === "/" || pathname === "/cart" || pathname.startsWith("/products");

  return (
    <footer className="mt-auto pb-16 md:pb-0">
      {showTrust && <TrustBar />}
      <NewsletterSignup />
      <div className="bg-[#2c3e2a] px-4 pb-10 pt-12 text-[#fbf9f4] md:px-6 md:pb-8 md:pt-16">
        <div className="mx-auto max-w-[1140px]">
          <div className="hidden grid-cols-4 gap-6 md:grid">
            {footerLinks.map((group) => <FooterColumn key={group.title} {...group} />)}
          </div>
          <div className="space-y-1 md:hidden">
            {footerLinks.map((group) => <details key={group.title} className="group border-b border-white/10"><summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-sm font-semibold uppercase tracking-widest"><span>{group.title}</span><ChevronDown className="h-4 w-4 text-primary-fixed transition-transform group-open:rotate-180" /></summary><ul className="space-y-3 pb-5 pl-2">{group.links.map((link) => <li key={link.label}><FooterLink {...link} /></li>)}</ul></details>)}
          </div>

          <div className="mt-12 grid gap-8 border-t border-white/10 pt-8 md:grid-cols-[1.25fr_1fr]">
            <div>
              <Link href="/" className="inline-flex items-center gap-2 font-serif text-2xl font-semibold"><Flower2 className="h-6 w-6 text-primary-fixed" />Bloom &amp; Stem</Link>
              <p className="mt-3 max-w-sm text-sm leading-6 text-white/65">Artisanal florals for life&apos;s most beautiful moments. Hand-tied with care and delivered with love.</p>
            </div>
            <StoreInformation />
          </div>

          <div className="mt-10 flex flex-col items-center gap-7 border-t border-white/10 pt-8 md:flex-row md:justify-between">
            <div className="flex items-center gap-5"><SocialLink label="Facebook">f</SocialLink><SocialLink label="Instagram">◎</SocialLink><SocialLink label="Pinterest">p</SocialLink><SocialLink label="X">x</SocialLink></div>
            <div className="flex flex-wrap justify-center gap-2" aria-label="Accepted payment methods">{["VISA", "MC", "AMEX", "Apple Pay", "G Pay"].map((method) => <span key={method} className="rounded border border-white/20 px-2 py-1 text-[10px] font-semibold text-white/55">{method}</span>)}</div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4 text-center text-xs text-white/45 md:flex-row md:justify-between md:text-left">
            <p>© {new Date().getFullYear()} Bloom &amp; Stem. All Rights Reserved.</p>
            <nav aria-label="Legal" className="flex items-center gap-3 uppercase tracking-wider"><Link href="/privacy" className="hover:text-primary-fixed">Privacy</Link><span>|</span><Link href="/terms" className="hover:text-primary-fixed">Terms</Link><span>|</span><Link href="/cookies" className="hover:text-primary-fixed">Cookies</Link></nav>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return <nav aria-label={title}><h2 className="text-sm font-semibold uppercase tracking-widest text-primary-fixed">{title}</h2><ul className="mt-5 space-y-3">{links.map((link) => <li key={link.label}><FooterLink {...link} /></li>)}</ul></nav>;
}

function FooterLink({ label, href }: { label: string; href: string }) {
  return <Link href={href} className="relative inline-block text-sm text-white/70 transition-colors after:absolute after:inset-x-1/2 after:-bottom-1 after:h-px after:bg-primary-fixed after:transition-all hover:text-primary-fixed hover:after:inset-x-0 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-fixed">{label}</Link>;
}

function StoreInformation() {
  return <section aria-labelledby="store-info-title"><h2 id="store-info-title" className="text-sm font-semibold uppercase tracking-widest text-primary-fixed">Visit our studio</h2><div className="mt-4 space-y-3 text-sm text-white/70"><p className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-fixed" /><span>128 Botanical Way<br />Portland, OR 97205</span></p><p className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary-fixed" /><a href="tel:+15035550142" className="hover:text-primary-fixed">(503) 555-0142</a></p><p className="flex items-start gap-3"><Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-primary-fixed" /><span>Mon–Sat: 9am–6pm<br />Sunday: 10am–4pm<br /><span className="text-white/50">Closed on major holidays</span></span></p></div></section>;
}

function SocialLink({ label, children }: { label: string; children: React.ReactNode }) {
  return <Link href="#" aria-label={label} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-sm font-semibold text-white/65 transition hover:scale-105 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-fixed">{children}</Link>;
}
