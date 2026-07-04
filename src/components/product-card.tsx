"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Star, ShoppingBag, ArrowRight } from "lucide-react";
import { useStore } from "@/store/useStore";
import { formatPrice, logAffiliateClick } from "@/lib/utils";

export interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    description: string;
    images: string[];
    priceOriginal: number;
    priceDiscounted: number;
    rating: number;
    reviewsCount: number;
    isTopPick?: boolean;
    isBestSeller?: boolean;
    category?: { name: string };
    affiliateLinks?: Array<{
      storeName: string;
      url: string;
      price: number;
      isPrimary: boolean;
    }>;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { wishlist, addToWishlist, removeFromWishlist } = useStore();
  const isWishlisted = wishlist.includes(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const discount = Math.round(
    ((product.priceOriginal - product.priceDiscounted) / product.priceOriginal) * 100
  );

  const primaryLink = product.affiliateLinks?.find((link) => link.isPrimary) || product.affiliateLinks?.[0];

  const handleCtaClick = (e: React.MouseEvent, storeName: string, url: string) => {
    logAffiliateClick("PRODUCT", product.id, storeName);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-[#EAE5D9] bg-[#FDFBF7] dark:border-[#2D2B2A] dark:bg-[#1A1A1A] hover:shadow-xl transition-all duration-300"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.isTopPick && (
          <span className="rounded bg-[#3E2723] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white dark:bg-[#C2B280] dark:text-[#111111]">
            Top Pick
          </span>
        )}
        {product.isBestSeller && (
          <span className="rounded bg-[#8B5A2B] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            Best Seller
          </span>
        )}
        {discount > 0 && (
          <span className="rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            -{discount}%
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={toggleWishlist}
        className="absolute top-3 right-3 z-10 rounded-full bg-[#FDFBF7]/85 p-2 text-[#706E6B] shadow-sm hover:bg-[#FDFBF7] hover:text-red-500 dark:bg-[#111111]/85 dark:hover:bg-[#111111] transition-all duration-300"
        aria-label="Wishlist Toggle"
      >
        <Heart
          size={18}
          className={`${isWishlisted ? "fill-red-500 text-red-500" : "text-current"}`}
        />
      </button>

      {/* Image container */}
      <Link href={`/product/${product.slug}`} className="block overflow-hidden bg-[#F5F2EB] dark:bg-[#111111] aspect-square relative">
        <img
          src={product.images[0]}
          alt={product.title}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {product.category && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B5A2B] dark:text-[#C2B280] mb-1">
            {product.category.name}
          </span>
        )}
        
        <Link href={`/product/${product.slug}`} className="hover:underline">
          <h3 className="font-serif text-base font-semibold text-[#111111] dark:text-[#FDFBF7] line-clamp-1">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mt-1.5 flex items-center gap-1">
          <div className="flex text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < Math.floor(product.rating) ? "fill-current" : "text-gray-300 dark:text-gray-600"}
              />
            ))}
          </div>
          <span className="text-xs text-[#706E6B] dark:text-[#A09D9A]">
            ({product.reviewsCount})
          </span>
        </div>

        <p className="mt-2 text-xs text-[#706E6B] dark:text-[#A09D9A] line-clamp-2">
          {product.description}
        </p>

        {/* Price layout */}
        <div className="mt-auto pt-4 border-t border-[#EAE5D9] dark:border-[#2D2B2A] flex items-end justify-between">
          <div>
            <div className="text-[10px] text-[#706E6B] dark:text-[#A09D9A] uppercase tracking-wider font-semibold">Best Price</div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-[#8B5A2B] dark:text-[#C2B280]">
                {formatPrice(product.priceDiscounted)}
              </span>
              {product.priceOriginal > product.priceDiscounted && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(product.priceOriginal)}
                </span>
              )}
            </div>
          </div>

          {primaryLink ? (
            <a
              href={primaryLink.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleCtaClick(e, primaryLink.storeName, primaryLink.url)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#3E2723] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#8B5A2B] dark:bg-[#C2B280] dark:text-[#111111] dark:hover:bg-[#FDFBF7] transition-all"
            >
              <span>Buy on {primaryLink.storeName}</span>
              <ArrowRight size={12} />
            </a>
          ) : (
            <Link
              href={`/product/${product.slug}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3.5 py-2 text-xs font-bold text-secondary-foreground hover:bg-[#3E2723] hover:text-white dark:hover:bg-[#FDFBF7] dark:hover:text-[#111111] transition-all"
            >
              <span>View Details</span>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
