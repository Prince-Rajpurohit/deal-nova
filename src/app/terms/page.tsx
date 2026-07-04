import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata = {
  title: "Terms & Conditions | Deal Nova",
  description: "Read our platform usage terms, disclaimer clauses, and acceptable behavior policies.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />

      <main className="flex-grow bg-[#FDFBF7] py-16 dark:bg-[#111111] transition-colors duration-300">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="border-b border-[#EAE5D9] pb-6 dark:border-[#2D2B2A]">
            <h1 className="font-serif text-3xl font-bold text-[#111111] dark:text-[#FDFBF7]">
              Terms & Conditions
            </h1>
            <p className="text-xs text-gray-400 mt-2">
              Last updated: July 4, 2026
            </p>
          </div>

          <div className="prose max-w-none text-[#706E6B] dark:text-[#A09D9A] text-sm leading-relaxed space-y-6">
            <p>
              Welcome to Deal Nova! These terms and conditions outline the rules and regulations for the use of Deal Nova's Website.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#111111] dark:text-[#FDFBF7] pt-4">
              1. Platform Purpose & Disclaimers
            </h2>
            <p>
              Deal Nova is a curated review, price comparison, and affiliate tracking portal. We do not sell items directly. All merchandise purchase contracts, product shipments, return policies, and billing disputes are handled entirely by our third-party merchant partners (Amazon, Flipkart, Myntra, etc.).
            </p>
            <p>
              While we update deal discounts and pricing comparisons regularly, we give no warranty on product availability, exact price matches, or retailer inventory status.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#111111] dark:text-[#FDFBF7] pt-4">
              2. Intellectual Property
            </h2>
            <p>
              Unless otherwise stated, Deal Nova and/or its licensors own the intellectual property rights for all material on Deal Nova. All intellectual property rights are reserved. You must not republish, sell, rent, or duplicate articles or design layouts from Deal Nova without our express consent.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#111111] dark:text-[#FDFBF7] pt-4">
              3. User Account Security
            </h2>
            <p>
              If you register an account, you are responsible for maintaining credentials confidentiality. We reserve the right to suspend or delete accounts that engage in spam comments or administrative attacks.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#111111] dark:text-[#FDFBF7] pt-4">
              4. Limitations of Liability
            </h2>
            <p>
              In no event shall Deal Nova, nor any of its editors or directors, be held liable for any purchase issues, defective products, or shipping delays originating from transactions completed on third-party retailer websites.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
