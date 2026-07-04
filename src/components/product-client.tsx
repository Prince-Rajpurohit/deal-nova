"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Star, Check, X, ShieldAlert, Award, StarHalf } from "lucide-react";
import { useStore } from "@/store/useStore";
import { formatPrice } from "@/lib/utils";
import ComparisonTable from "@/components/comparison-table";
import ProductCard from "@/components/product-card";

interface AffiliateLink {
  id: string;
  storeName: string;
  url: string;
  price: number;
  isPrimary: boolean;
}

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  images: string[];
  priceOriginal: number;
  priceDiscounted: number;
  rating: number;
  reviewsCount: number;
  features: string[];
  specs: any;
  pros: string[];
  cons: string[];
  isTopPick?: boolean;
  isBestSeller?: boolean;
  categoryId: string;
  category?: { name: string };
  affiliateLinks?: AffiliateLink[];
}

interface ProductClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductClient({ product, relatedProducts }: ProductClientProps) {
  const { wishlist, addToWishlist, removeFromWishlist, addToRecentlyViewed } = useStore();
  const [activeImage, setActiveImage] = useState(product.images[0] || "");
  const isWishlisted = wishlist.includes(product.id);

  useEffect(() => {
    // Record recently viewed item in Zustand store
    addToRecentlyViewed(product.id);
  }, [product.id, addToRecentlyViewed]);

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const discount = Math.round(
    ((product.priceOriginal - product.priceDiscounted) / product.priceOriginal) * 100
  );

  return (
    <div className="space-y-16">
      
      {/* Two Column details section */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        
        {/* Left Column: Premium Gallery */}
        <div className="space-y-4">
          <div className="aspect-square w-full overflow-hidden rounded-2xl border border-[#EAE5D9] bg-[#F5F2EB] dark:border-[#2D2B2A] dark:bg-[#1A1A1A] flex items-center justify-center relative">
            <img
              src={activeImage}
              alt={product.title}
              className="h-full w-full object-cover object-center transition-all duration-300"
            />
            {product.isTopPick && (
              <span className="absolute top-4 left-4 z-10 rounded bg-[#3E2723] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white dark:bg-[#C2B280] dark:text-[#111111]">
                Top Pick
              </span>
            )}
          </div>
          
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto no-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 bg-[#F5F2EB] dark:bg-[#111111] transition-all ${
                    activeImage === img
                      ? "border-[#8B5A2B] dark:border-[#C2B280]"
                      : "border-transparent hover:border-[#EAE5D9] dark:hover:border-[#2D2B2A]"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information & Comparison */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            {product.category && (
              <span className="text-xs font-bold uppercase tracking-widest text-[#8B5A2B] dark:text-[#C2B280]">
                {product.category.name}
              </span>
            )}
            <button
              onClick={toggleWishlist}
              className="flex items-center gap-1.5 rounded-full border border-[#EAE5D9] bg-[#FDFBF7] px-4 py-1.5 text-xs font-bold text-[#706E6B] hover:text-red-500 dark:border-[#2D2B2A] dark:bg-[#1A1A1A] dark:text-[#A09D9A] transition-all"
            >
              <Heart size={14} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
              <span>{isWishlisted ? "Saved" : "Save to Wishlist"}</span>
            </button>
          </div>

          <h1 className="font-serif text-3xl font-bold leading-tight text-[#111111] dark:text-[#FDFBF7]">
            {product.title}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex text-amber-500 items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.floor(product.rating) ? "fill-current" : "text-gray-300 dark:text-gray-700"}
                />
              ))}
              <span className="ml-2 text-sm font-bold text-[#111111] dark:text-[#FDFBF7]">
                {product.rating}
              </span>
            </div>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs text-[#706E6B] dark:text-[#A09D9A]">
              {product.reviewsCount} customer reviews
            </span>
          </div>

          {/* Main Price display */}
          <div className="flex items-end gap-3.5 border-b border-[#EAE5D9] pb-6 dark:border-[#2D2B2A]">
            <span className="text-3xl font-extrabold text-[#8B5A2B] dark:text-[#C2B280]">
              {formatPrice(product.priceDiscounted)}
            </span>
            {product.priceOriginal > product.priceDiscounted && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.priceOriginal)}
                </span>
                <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-bold text-red-800 dark:bg-red-950/20 dark:text-red-400">
                  Save {discount}%
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed text-[#706E6B] dark:text-[#A09D9A]">
            {product.description}
          </p>

          {/* Comparison Table Block */}
          {product.affiliateLinks && product.affiliateLinks.length > 0 && (
            <ComparisonTable
              productId={product.id}
              originalPrice={product.priceOriginal}
              links={product.affiliateLinks}
            />
          )}

          {/* Key Features bullet points */}
          {product.features.length > 0 && (
            <div className="space-y-3 pt-6 border-t border-[#EAE5D9] dark:border-[#2D2B2A]">
              <h4 className="font-serif text-sm font-bold text-[#111111] dark:text-[#FDFBF7]">
                Key Features & Highlights
              </h4>
              <ul className="space-y-2 text-xs text-[#706E6B] dark:text-[#A09D9A]">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400 mt-0.5">
                      <Award size={10} />
                    </span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>

      {/* Pros & Cons comparison */}
      {(product.pros.length > 0 || product.cons.length > 0) && (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 pt-12 border-t border-[#EAE5D9] dark:border-[#2D2B2A]">
          {/* Pros */}
          <div className="rounded-xl border border-green-200 bg-green-50/20 p-6 dark:border-green-950/30 dark:bg-green-950/5">
            <h4 className="font-serif text-base font-bold text-green-800 dark:text-green-400 flex items-center gap-2 mb-4">
              <Check size={18} className="rounded-full bg-green-100 p-0.5 dark:bg-green-900/30" />
              <span>Reasons To Buy (Pros)</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-[#706E6B] dark:text-[#A09D9A]">
              {product.pros.map((pro, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">•</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cons */}
          <div className="rounded-xl border border-red-200 bg-red-50/20 p-6 dark:border-red-950/30 dark:bg-red-950/5">
            <h4 className="font-serif text-base font-bold text-red-800 dark:text-red-400 flex items-center gap-2 mb-4">
              <X size={18} className="rounded-full bg-red-100 p-0.5 dark:bg-red-900/30" />
              <span>Considerations (Cons)</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-[#706E6B] dark:text-[#A09D9A]">
              {product.cons.map((con, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-red-600 font-bold mt-0.5">•</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Specifications Table */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <section className="pt-12 border-t border-[#EAE5D9] dark:border-[#2D2B2A]">
          <h3 className="font-serif text-xl font-bold text-[#111111] dark:text-[#FDFBF7] mb-6">
            Technical Specifications
          </h3>
          <div className="overflow-hidden rounded-xl border border-[#EAE5D9] dark:border-[#2D2B2A]">
            <table className="w-full text-left text-xs border-collapse">
              <tbody>
                {Object.entries(product.specs).map(([key, val]: [string, any], idx) => (
                  <tr
                    key={key}
                    className={`${
                      idx % 2 === 0
                        ? "bg-[#FDFBF7] dark:bg-[#1A1A1A]"
                        : "bg-[#F5F2EB] dark:bg-[#111111]"
                    } border-b border-[#EAE5D9] dark:border-[#2D2B2A] last:border-0`}
                  >
                    <td className="px-5 py-3 font-bold text-[#111111] dark:text-[#FDFBF7] w-1/3">
                      {key}
                    </td>
                    <td className="px-5 py-3 text-[#706E6B] dark:text-[#A09D9A]">
                      {val.toString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="pt-16 border-t border-[#EAE5D9] dark:border-[#2D2B2A]">
          <h3 className="font-serif text-2xl font-bold text-[#111111] dark:text-[#FDFBF7] mb-8 text-center md:text-left">
            Related Collections
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.slice(0, 4).map((item) => (
              <ProductCard key={item.id} product={item as any} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
