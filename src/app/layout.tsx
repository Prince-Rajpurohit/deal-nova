import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import ProviderWrapper from "@/components/provider-wrapper";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Deal Nova | Premium Curated Fashion, Sneaker & Tech Deals",
  description: "Discover curated luxury fashion, sneakers, gadgets, watches, and trending lifestyle deals. Handpicked recommendations with direct affiliate benefits.",
  keywords: ["affiliate marketing", "luxury fashion", "sneakers", "premium watches", "gadget reviews", "deals finder"],
  authors: [{ name: "Deal Nova Team" }],
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  openGraph: {
    title: "Deal Nova | Premium Curated Affiliate Deals",
    description: "Curated collection of luxury items, tech, and lifestyle items at deep discounts.",
    url: "/",
    siteName: "Deal Nova",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Deal Nova | Premium Curated Affiliate Deals",
    description: "Handpicked premium fashion, gadgets, and sneakers.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${montserrat.variable} font-sans antialiased bg-[#FDFBF7] text-[#111111] dark:bg-[#111111] dark:text-[#FDFBF7]`}
      >
        <ProviderWrapper>
          <div className="flex flex-col min-h-screen">
            {children}
          </div>
        </ProviderWrapper>
      </body>
    </html>
  );
}
