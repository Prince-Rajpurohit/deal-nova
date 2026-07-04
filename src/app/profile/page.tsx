"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Heart, Clock, ArrowRight, Settings } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { useStore } from "@/store/useStore";

type Tab = "wishlist" | "recent" | "account";

function ProfileContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const wishlistIds = useStore((state) => state.wishlist);
  const recentIds = useStore((state) => state.recentlyViewed);
  
  const [activeTab, setActiveTab] = useState<Tab>("wishlist");

  // Sync tab from URL search parameters if any
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "wishlist" || tabParam === "recent" || tabParam === "account") {
      setActiveTab(tabParam as Tab);
    }
  }, [searchParams]);

  // Protect page
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch Wishlist products
  const { data: wishlistProducts, isLoading: loadingWishlist } = useQuery({
    queryKey: ["wishlist-products", wishlistIds],
    queryFn: async () => {
      if (wishlistIds.length === 0) return [];
      const res = await fetch(`/api/products/bulk?ids=${wishlistIds.join(",")}`);
      if (!res.ok) throw new Error("Failed to fetch wishlist products");
      return res.json();
    },
    enabled: wishlistIds.length > 0,
  });

  // Fetch Recently Viewed products
  const { data: recentProducts, isLoading: loadingRecent } = useQuery({
    queryKey: ["recent-products", recentIds],
    queryFn: async () => {
      if (recentIds.length === 0) return [];
      const res = await fetch(`/api/products/bulk?ids=${recentIds.join(",")}`);
      if (!res.ok) throw new Error("Failed to fetch recently viewed products");
      return res.json();
    },
    enabled: recentIds.length > 0,
  });

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFBF7] dark:bg-[#111111]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8B5A2B] border-t-transparent dark:border-[#C2B280]" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <>
      <Navbar />
      
      <main className="flex-grow bg-[#FDFBF7] py-12 dark:bg-[#111111] transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Profile Header */}
          <div className="rounded-2xl border border-[#EAE5D9] bg-[#F5F2EB] p-6 dark:border-[#2D2B2A] dark:bg-[#1A1A1A] flex flex-col md:flex-row items-center gap-6">
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="h-24 w-24 rounded-full border-2 border-white object-cover shadow-md dark:border-gray-800"
              />
            ) : (
              <span className="flex h-24 w-24 items-center justify-center rounded-full bg-[#8B5A2B] text-white text-3xl font-serif">
                {session.user?.name?.[0] || "U"}
              </span>
            )}

            <div className="text-center md:text-left flex-grow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-center md:justify-start gap-2.5">
                <h2 className="font-serif text-2xl font-bold text-[#111111] dark:text-[#FDFBF7]">
                  {session.user?.name || "Premium Member"}
                </h2>
                <span className="inline-flex max-w-max self-center rounded bg-[#3E2723] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white dark:bg-[#C2B280] dark:text-[#111111]">
                  {session.user?.role || "USER"}
                </span>
              </div>
              <p className="text-sm text-[#706E6B] dark:text-[#A09D9A] mt-1">
                {session.user?.email}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Member since July 2026
              </p>
            </div>
          </div>

          {/* Profile Content Tabs */}
          <div className="mt-10 flex border-b border-[#EAE5D9] dark:border-[#2D2B2A] gap-6 text-sm font-medium overflow-x-auto">
            <button
              onClick={() => setActiveTab("wishlist")}
              className={`flex items-center gap-2 pb-4 border-b-2 transition-all ${
                activeTab === "wishlist"
                  ? "border-[#8B5A2B] text-[#8B5A2B] dark:border-[#C2B280] dark:text-[#C2B280]"
                  : "border-transparent text-[#706E6B] hover:text-[#111111] dark:text-[#A09D9A] dark:hover:text-white"
              }`}
            >
              <Heart size={16} />
              <span>Wishlist ({wishlistIds.length})</span>
            </button>
            
            <button
              onClick={() => setActiveTab("recent")}
              className={`flex items-center gap-2 pb-4 border-b-2 transition-all ${
                activeTab === "recent"
                  ? "border-[#8B5A2B] text-[#8B5A2B] dark:border-[#C2B280] dark:text-[#C2B280]"
                  : "border-transparent text-[#706E6B] hover:text-[#111111] dark:text-[#A09D9A] dark:hover:text-white"
              }`}
            >
              <Clock size={16} />
              <span>Recently Viewed ({recentIds.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("account")}
              className={`flex items-center gap-2 pb-4 border-b-2 transition-all ${
                activeTab === "account"
                  ? "border-[#8B5A2B] text-[#8B5A2B] dark:border-[#C2B280] dark:text-[#C2B280]"
                  : "border-transparent text-[#706E6B] hover:text-[#111111] dark:text-[#A09D9A] dark:hover:text-white"
              }`}
            >
              <Settings size={16} />
              <span>Account Settings</span>
            </button>
          </div>

          {/* Tab Panes */}
          <div className="mt-8">
            {/* Wishlist Pane */}
            {activeTab === "wishlist" && (
              <div>
                {wishlistIds.length === 0 ? (
                  <div className="text-center py-16">
                    <Heart className="mx-auto text-gray-300 dark:text-gray-700 mb-4" size={48} />
                    <h3 className="font-serif text-xl font-bold text-[#111111] dark:text-[#FDFBF7]">
                      Your Wishlist is Empty
                    </h3>
                    <p className="text-sm text-[#706E6B] dark:text-[#A09D9A] mt-2 max-w-sm mx-auto">
                      Tap the heart icon on any luxury deal card, sneakers or gadgets to save them here.
                    </p>
                    <button
                      onClick={() => router.push("/")}
                      className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#3E2723] px-6 py-3 text-sm font-bold text-white hover:bg-[#8B5A2B] dark:bg-[#C2B280] dark:text-[#111111] dark:hover:bg-[#FDFBF7] transition-all"
                    >
                      <span>Explore Trending Deals</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ) : loadingWishlist ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: wishlistIds.length }).map((_, idx) => (
                      <div key={idx} className="h-96 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {wishlistProducts?.map((product: any) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Recently Viewed Pane */}
            {activeTab === "recent" && (
              <div>
                {recentIds.length === 0 ? (
                  <div className="text-center py-16">
                    <Clock className="mx-auto text-gray-300 dark:text-gray-700 mb-4" size={48} />
                    <h3 className="font-serif text-xl font-bold text-[#111111] dark:text-[#FDFBF7]">
                      No History Yet
                    </h3>
                    <p className="text-sm text-[#706E6B] dark:text-[#A09D9A] mt-2 max-w-sm mx-auto">
                      Products you inspect will automatically display here for quick reference and comparison.
                    </p>
                  </div>
                ) : loadingRecent ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: recentIds.length }).map((_, idx) => (
                      <div key={idx} className="h-96 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {recentProducts?.map((product: any) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Account Settings Pane */}
            {activeTab === "account" && (
              <div className="max-w-2xl rounded-xl border border-[#EAE5D9] bg-white p-6 dark:border-[#2D2B2A] dark:bg-[#1A1A1A]">
                <h3 className="font-serif text-lg font-bold text-[#111111] dark:text-[#FDFBF7] mb-6">
                  Account Details
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
                      Full Name
                    </label>
                    <input
                      type="text"
                      disabled
                      value={session.user?.name || ""}
                      className="w-full mt-1 rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-3 px-4 text-sm text-[#706E6B] dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-gray-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
                      Email Address
                    </label>
                    <input
                      type="email"
                      disabled
                      value={session.user?.email || ""}
                      className="w-full mt-1 rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-3 px-4 text-sm text-[#706E6B] dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-gray-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
                      Account Role
                    </label>
                    <input
                      type="text"
                      disabled
                      value={session.user?.role || "USER"}
                      className="w-full mt-1 rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-3 px-4 text-sm text-[#706E6B] dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-gray-400"
                    />
                  </div>
                </div>
                
                <div className="mt-8 border-t border-[#EAE5D9] pt-6 dark:border-[#2D2B2A]">
                  <p className="text-xs text-[#706E6B] dark:text-[#A09D9A]">
                    To modify your email address or password settings, please write to our customer support team or configure third-party OAuth providers.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#FDFBF7] dark:bg-[#111111]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8B5A2B] border-t-transparent dark:border-[#C2B280]" />
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}
