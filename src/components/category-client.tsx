"use client";

import React, { useState, useMemo } from "react";
import { SlidersHorizontal, ArrowUpDown, Grid, List, Search } from "lucide-react";
import ProductCard from "@/components/product-card";
import { formatPrice } from "@/lib/utils";

interface AffiliateLink {
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
  isTopPick?: boolean;
  isBestSeller?: boolean;
  category?: { name: string };
  affiliateLinks?: AffiliateLink[];
}

interface CategoryClientProps {
  categoryName: string;
  categoryDescription: string;
  products: Product[];
}

export default function CategoryClient({
  categoryName,
  categoryDescription,
  products,
}: CategoryClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState<number>(() => {
    if (products.length === 0) return 30000;
    return Math.max(...products.map((p) => p.priceDiscounted));
  });
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");

  // Get list of unique stores in this category
  const availableStores = useMemo(() => {
    const stores = new Set<string>();
    products.forEach((p) => {
      p.affiliateLinks?.forEach((link) => {
        stores.add(link.storeName);
      });
    });
    return Array.from(stores);
  }, [products]);

  // Max price limit calculation
  const absMaxPrice = useMemo(() => {
    if (products.length === 0) return 30000;
    return Math.max(...products.map((p) => p.priceDiscounted));
  }, [products]);

  const toggleStore = (store: string) => {
    if (selectedStores.includes(store)) {
      setSelectedStores(selectedStores.filter((s) => s !== store));
    } else {
      setSelectedStores([...selectedStores, store]);
    }
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // 2. Filter by max price
    result = result.filter((p) => p.priceDiscounted <= maxPrice);

    // 3. Filter by store names
    if (selectedStores.length > 0) {
      result = result.filter((p) =>
        p.affiliateLinks?.some((link) => selectedStores.includes(link.storeName))
      );
    }

    // 4. Sort results
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.priceDiscounted - b.priceDiscounted);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.priceDiscounted - a.priceDiscounted);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, searchQuery, maxPrice, selectedStores, sortBy]);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
      {/* Filters Sidebar */}
      <div className="space-y-6 lg:sticky lg:top-24 max-h-[80vh] overflow-y-auto pr-2">
        <div className="flex items-center justify-between border-b border-[#EAE5D9] pb-4 dark:border-[#2D2B2A]">
          <h3 className="font-serif text-lg font-bold text-[#111111] dark:text-[#FDFBF7] flex items-center gap-2">
            <SlidersHorizontal size={18} />
            <span>Filters</span>
          </h3>
          {(searchQuery || selectedStores.length > 0 || maxPrice < absMaxPrice) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setMaxPrice(absMaxPrice);
                setSelectedStores([]);
                setSortBy("featured");
              }}
              className="text-xs text-[#8B5A2B] hover:underline dark:text-[#C2B280] font-semibold"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Search Input */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
            Search Products
          </label>
          <div className="relative mt-2 flex items-center">
            <Search size={16} className="absolute left-3 text-[#706E6B] dark:text-[#A09D9A]" />
            <input
              type="text"
              placeholder="Type keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-2.5 pl-10 pr-4 text-xs text-[#111111] placeholder-[#706E6B] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
            />
          </div>
        </div>

        {/* Price Slider */}
        {absMaxPrice > 0 && (
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
              <span>Max Price</span>
              <span className="text-[#8B5A2B] dark:text-[#C2B280]">{formatPrice(maxPrice)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={absMaxPrice}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="mt-3 w-full accent-[#8B5A2B] dark:accent-[#C2B280] cursor-pointer"
            />
            <div className="mt-1 flex items-center justify-between text-[10px] text-gray-400">
              <span>{formatPrice(0)}</span>
              <span>{formatPrice(absMaxPrice)}</span>
            </div>
          </div>
        )}

        {/* Store Brand Filters */}
        {availableStores.length > 0 && (
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
              Retail Stores
            </label>
            <div className="mt-3 space-y-2">
              {availableStores.map((store) => (
                <label key={store} className="flex items-center gap-2.5 text-xs text-[#706E6B] dark:text-[#A09D9A] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selectedStores.includes(store)}
                    onChange={() => toggleStore(store)}
                    className="rounded border-[#EAE5D9] text-[#8B5A2B] focus:ring-[#8B5A2B] dark:border-[#2D2B2A]"
                  />
                  <span>{store}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Sorting Dropdown */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A] flex items-center gap-1.5">
            <ArrowUpDown size={12} />
            <span>Sort By</span>
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="mt-2 w-full rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-2.5 px-3 text-xs text-[#111111] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
          >
            <option value="featured">Featured Picks</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="lg:col-span-3">
        <div className="flex items-center justify-between border-b border-[#EAE5D9] pb-4 dark:border-[#2D2B2A] mb-6">
          <p className="text-xs text-[#706E6B] dark:text-[#A09D9A]">
            Showing <span className="font-bold text-[#111111] dark:text-white">{filteredProducts.length}</span> of{" "}
            <span className="font-bold">{products.length}</span> products
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#EAE5D9] rounded-2xl dark:border-[#2D2B2A]">
            <h3 className="font-serif text-lg font-bold text-[#111111] dark:text-[#FDFBF7]">
              No Products Match Filters
            </h3>
            <p className="text-xs text-[#706E6B] dark:text-[#A09D9A] mt-2">
              Try adjusting your max price slider, store selections, or search keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
