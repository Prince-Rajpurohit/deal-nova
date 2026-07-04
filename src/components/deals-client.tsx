"use client";

import React, { useState, useMemo } from "react";
import { Search, Tag, Flame, Percent } from "lucide-react";
import CountdownTimer from "@/components/countdown-timer";
import { formatPrice, logAffiliateClick } from "@/lib/utils";

interface Deal {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image: string | null;
  discountPercentage: number;
  originalPrice: number;
  dealPrice: number;
  storeName: string;
  affiliateUrl: string;
  endsAt: string | null;
  categoryId: string;
  category: { name: string };
}

interface DealsClientProps {
  deals: Deal[];
  categories: Array<{ id: string; name: string }>;
}

export default function DealsClient({ deals, categories }: DealsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStore, setSelectedStore] = useState<string>("all");

  const storesList = useMemo(() => {
    const list = new Set<string>();
    deals.forEach((d) => list.add(d.storeName));
    return Array.from(list);
  }, [deals]);

  const filteredDeals = useMemo(() => {
    let result = [...deals];

    // Search query filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          (d.description && d.description.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((d) => d.categoryId === selectedCategory);
    }

    // Store filter
    if (selectedStore !== "all") {
      result = result.filter((d) => d.storeName === selectedStore);
    }

    return result;
  }, [deals, searchQuery, selectedCategory, selectedStore]);

  const handleGrabClick = (dealId: string, storeName: string) => {
    logAffiliateClick("DEAL", dealId, storeName);
  };

  return (
    <div className="space-y-8">
      
      {/* Filtering Options header */}
      <div className="rounded-2xl border border-[#EAE5D9] bg-[#F5F2EB] p-6 dark:border-[#2D2B2A] dark:bg-[#1A1A1A] space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Search bar */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
              Search Deals
            </label>
            <div className="relative mt-2 flex items-center">
              <Search size={16} className="absolute left-3 text-[#706E6B] dark:text-[#A09D9A]" />
              <input
                type="text"
                placeholder="Search offer titles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-[#EAE5D9] bg-[#FDFBF7] py-2.5 pl-10 pr-4 text-xs text-[#111111] placeholder-[#706E6B] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
              Filter Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="mt-2 w-full rounded-lg border border-[#EAE5D9] bg-[#FDFBF7] py-2.5 px-3 text-xs text-[#111111] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Store Dropdown */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
              Filter Store
            </label>
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="mt-2 w-full rounded-lg border border-[#EAE5D9] bg-[#FDFBF7] py-2.5 px-3 text-xs text-[#111111] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
            >
              <option value="all">All Retailers</option>
              {storesList.map((store) => (
                <option key={store} value={store}>
                  {store}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Grid List of deals */}
      {filteredDeals.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#EAE5D9] rounded-2xl dark:border-[#2D2B2A]">
          <Flame className="mx-auto text-gray-300 dark:text-gray-700 mb-4" size={48} />
          <h3 className="font-serif text-lg font-bold text-[#111111] dark:text-[#FDFBF7]">
            No Active Deals Found
          </h3>
          <p className="text-xs text-[#706E6B] dark:text-[#A09D9A] mt-2">
            Try resetting your filters or search keywords.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDeals.map((deal) => {
            const percentage = Math.round(deal.discountPercentage);
            return (
              <div
                key={deal.id}
                className="group relative overflow-hidden rounded-2xl border border-[#EAE5D9] bg-[#FDFBF7] p-5 dark:border-[#2D2B2A] dark:bg-[#1A1A1A] hover:shadow-lg transition-all"
              >
                <div className="flex gap-4">
                  {deal.image && (
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-[#F5F2EB] dark:bg-[#111111]">
                      <img
                        src={deal.image}
                        alt=""
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="flex flex-col justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800 dark:bg-red-950/30 dark:text-red-400">
                        {percentage}% OFF
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[#8B5A2B] dark:text-[#C2B280]">
                        {deal.category.name}
                      </span>
                    </div>
                    
                    <h3 className="font-serif text-base font-bold text-[#111111] dark:text-[#FDFBF7] line-clamp-1 leading-snug mt-1.5">
                      {deal.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-base font-bold text-red-600 dark:text-red-400">
                        {formatPrice(deal.dealPrice)}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(deal.originalPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                {deal.description && (
                  <p className="mt-3.5 text-xs text-[#706E6B] dark:text-[#A09D9A] line-clamp-2">
                    {deal.description}
                  </p>
                )}

                <div className="mt-5 border-t border-[#EAE5D9] pt-4 dark:border-[#2D2B2A] flex flex-wrap items-center justify-between gap-4">
                  {deal.endsAt && <CountdownTimer endsAt={deal.endsAt} />}
                  <a
                    href={deal.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleGrabClick(deal.id, deal.storeName)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#3E2723] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#8B5A2B] dark:bg-[#C2B280] dark:text-[#111111] dark:hover:bg-[#FDFBF7] transition-all ml-auto"
                  >
                    <span>Grab Coupon on {deal.storeName}</span>
                    <Percent size={12} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
