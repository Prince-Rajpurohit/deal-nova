"use client";

import React from "react";
import { ArrowUpRight, CheckCircle2, ShieldAlert } from "lucide-react";
import { formatPrice, logAffiliateClick } from "@/lib/utils";

interface AffiliateLink {
  id: string;
  storeName: string;
  url: string;
  price: number;
  isPrimary: boolean;
}

interface ComparisonTableProps {
  productId: string;
  originalPrice: number;
  links: AffiliateLink[];
}

export default function ComparisonTable({ productId, originalPrice, links }: ComparisonTableProps) {
  if (!links || links.length === 0) return null;

  // Sort links: primary first, then by price ascending
  const sortedLinks = [...links].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return a.price - b.price;
  });

  const bestPrice = Math.min(...links.map((link) => link.price));

  const handleLinkClick = (storeName: string) => {
    logAffiliateClick("PRODUCT", productId, storeName);
  };

  return (
    <div className="w-full rounded-xl border border-[#EAE5D9] bg-[#FDFBF7] p-5 dark:border-[#2D2B2A] dark:bg-[#1A1A1A] transition-all">
      <div className="flex items-center justify-between border-b border-[#EAE5D9] pb-4 dark:border-[#2D2B2A]">
        <div>
          <h4 className="font-serif text-lg font-bold text-[#111111] dark:text-[#FDFBF7]">
            Price Comparison
          </h4>
          <p className="text-xs text-[#706E6B] dark:text-[#A09D9A]">
            Compare prices across major affiliate stores.
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-bold tracking-wider text-green-600 dark:text-green-400">
            Best Offer
          </span>
          <div className="text-xl font-extrabold text-green-600 dark:text-green-400">
            {formatPrice(bestPrice)}
          </div>
        </div>
      </div>

      <div className="mt-4 divide-y divide-[#EAE5D9] dark:divide-[#2D2B2A]">
        {sortedLinks.map((link) => {
          const discount = Math.round(((originalPrice - link.price) / originalPrice) * 100);
          const isBestOffer = link.price === bestPrice;

          return (
            <div
              key={link.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3.5 gap-4"
            >
              {/* Store Name & Badge */}
              <div className="flex items-center gap-3">
                <span className="font-serif text-base font-bold text-[#111111] dark:text-[#FDFBF7]">
                  {link.storeName}
                </span>
                {isBestOffer && (
                  <span className="inline-flex items-center gap-1 rounded bg-green-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle2 size={10} />
                    Best Price
                  </span>
                )}
                {link.isPrimary && (
                  <span className="rounded bg-amber-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-800 dark:bg-amber-950/30 dark:text-amber-400">
                    Featured
                  </span>
                )}
              </div>

              {/* Price & Savings */}
              <div className="flex items-center justify-between sm:justify-end gap-6">
                <div className="text-right sm:block">
                  <div className="text-base font-bold text-[#111111] dark:text-[#FDFBF7]">
                    {formatPrice(link.price)}
                  </div>
                  {discount > 0 && (
                    <div className="text-[10px] text-green-600 dark:text-green-400 font-semibold">
                      Save {discount}%
                    </div>
                  )}
                </div>

                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleLinkClick(link.storeName)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-bold transition-all ${
                    isBestOffer
                      ? "bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                      : "bg-[#3E2723] text-white hover:bg-[#8B5A2B] dark:bg-[#C2B280] dark:text-[#111111] dark:hover:bg-[#FDFBF7]"
                  }`}
                >
                  <span>Go to Store</span>
                  <ArrowUpRight size={12} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#F5F2EB] p-3 text-[11px] text-[#706E6B] dark:bg-[#1A1A1A] dark:text-[#A09D9A]">
        <ShieldAlert size={14} className="flex-shrink-0 text-amber-600" />
        <span>
          Prices are updated regularly. Click through to the retailer store to verify inventory status, exact shipping costs, and active promo discounts.
        </span>
      </div>
    </div>
  );
}
