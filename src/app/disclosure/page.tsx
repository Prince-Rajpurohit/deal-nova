import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata = {
  title: "Affiliate Disclosure | Deal Nova",
  description: "Read our transparent disclosures on how we earn affiliate advertising commissions from Amazon, Flipkart, Myntra, and other partner programs.",
};

export default function DisclosurePage() {
  return (
    <>
      <Navbar />

      <main className="flex-grow bg-[#FDFBF7] py-16 dark:bg-[#111111] transition-colors duration-300">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="border-b border-[#EAE5D9] pb-6 dark:border-[#2D2B2A]">
            <h1 className="font-serif text-3xl font-bold text-[#111111] dark:text-[#FDFBF7]">
              Affiliate Disclosure
            </h1>
            <p className="text-xs text-gray-400 mt-2">
              Last updated: July 4, 2026
            </p>
          </div>

          <div className="prose max-w-none text-[#706E6B] dark:text-[#A09D9A] text-sm leading-relaxed space-y-6">
            <p className="font-semibold text-base text-[#111111] dark:text-[#FDFBF7]">
              In compliance with the Federal Trade Commission (FTC) guidelines and standard advertising practices, we want to explain how we make money through this platform.
            </p>
            
            <p>
              Deal Nova is a participant in several affiliate advertising programs. When our editors identify and review a product (such as sneakers, watches, or gadgets), we locate active purchase links from leading stores, including:
            </p>

            <ul className="list-disc pl-5 space-y-2 font-bold text-[#3E2723] dark:text-[#C2B280]">
              <li>Amazon Associates Program (Amazon.in)</li>
              <li>Flipkart Affiliate Program</li>
              <li>Myntra Affiliate Program</li>
            </ul>

            <p className="pt-4">
              When you click on these outbound retailer links on our product comparison tables or flash deal modules, unique tracking cookies are loaded in your browser. If you finalize a transaction on that retailer's site within the cookie cookie-window (typically 24 to 48 hours), the retailer pays Deal Nova a minor commission.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#111111] dark:text-[#FDFBF7] pt-4">
              Does This Change The Price I Pay?
            </h2>
            <p className="font-bold text-[#111111] dark:text-[#FDFBF7]">
              No. The commissions we earn are paid directly by the retailer out of their advertising budget. The retail pricing, active discounts, coupons, and checkout totals remain identical to what you would pay if you visited their website directly.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#111111] dark:text-[#FDFBF7] pt-4">
              Our Curation Promise
            </h2>
            <p>
              Although we receive commissions, our selections are purely driven by curation quality and value. We regularly highlight "pros and cons" detailing product flaws, and we compare prices across competing stores so you can choose the absolute cheapest option. We never recommend low-quality items simply to earn a commission.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
