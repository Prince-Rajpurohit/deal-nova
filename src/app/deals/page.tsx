import React from "react";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import DealsClient from "@/components/deals-client";
import { MOCK_DEALS, MOCK_CATEGORIES } from "@/lib/mock-data";

export const metadata = {
  title: "Flash Deals Tracker | Deal Nova",
  description: "Browse daily coupon codes, flash sales, and price drops on luxury fashion, sneakers, and gadgets.",
};

export default async function DealsPage() {
  // Safe fetch with fallbacks
  let deals = MOCK_DEALS;
  let categories = MOCK_CATEGORIES;

  try {
    const dbCategories = await prisma.category.findMany({ select: { id: true, name: true } });
    if (dbCategories.length > 0) {
      categories = dbCategories as any;
    }

    const dbDeals = await prisma.deal.findMany({
      include: {
        category: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    if (dbDeals.length > 0) {
      deals = dbDeals as any;
    }
  } catch (error) {
    console.warn("Prisma deals query failed, falling back to mock deals:", error);
  }

  return (
    <>
      <Navbar />

      <main className="flex-grow bg-[#FDFBF7] py-12 dark:bg-[#111111] transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="mb-12 border-b border-[#EAE5D9] pb-8 dark:border-[#2D2B2A] text-center lg:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8B5A2B] dark:text-[#C2B280]">
              Flash Savings Hub
            </span>
            <h1 className="mt-2 font-serif text-4xl font-bold text-[#111111] dark:text-[#FDFBF7]">
              Latest Active Deals
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#706E6B] dark:text-[#A09D9A]">
              We audit these links automatically every hour. Prices reflect active coupon applications and flash-sale discounts.
            </p>
          </div>

          <DealsClient
            deals={deals as any}
            categories={categories as any}
          />

        </div>
      </main>

      <Footer />
    </>
  );
}
