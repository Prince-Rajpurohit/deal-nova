"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  ShoppingBag, Tag, BookOpen, Mail, ArrowUpRight, 
  BarChart3, MousePointerClick, RefreshCw, Star 
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface AnalyticsData {
  counts: {
    products: number;
    blogs: number;
    deals: number;
    subscribers: number;
    clicks: number;
  };
  clicksByStore: Array<{
    storeName: string;
    _count: { id: number };
  }>;
  topProducts: Array<{
    title: string;
    rating: number;
    clicks: number;
  }>;
}

export default function AdminDashboardOverview() {
  const { data, isLoading, isError, refetch, isRefetching } = useQuery<AnalyticsData>({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const res = await fetch("/api/admin/analytics");
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8B5A2B] border-t-transparent dark:border-[#C2B280]" />
          <p className="text-xs text-[#706E6B] dark:text-[#A09D9A]">Loading analytics database metrics...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-950/20 dark:bg-red-950/5">
        <h3 className="font-serif text-lg font-bold text-red-800 dark:text-red-400">Failed to Load Dashboard Data</h3>
        <p className="text-xs text-red-700 dark:text-red-300 mt-2">Verify database connections and authenticate correctly.</p>
        <button 
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-red-800 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const statCards = [
    { name: "Products Cataloged", value: data.counts.products, icon: ShoppingBag, color: "bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400" },
    { name: "Active Flash Deals", value: data.counts.deals, icon: Tag, color: "bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400" },
    { name: "Published Blogs", value: data.counts.blogs, icon: BookOpen, color: "bg-purple-100 text-purple-800 dark:bg-purple-950/30 dark:text-purple-400" },
    { name: "Subscribers Club", value: data.counts.subscribers, icon: Mail, color: "bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400" },
  ];

  return (
    <div className="space-y-8">
      {/* Header title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#111111] dark:text-[#FDFBF7]">
            Overview Dashboard
          </h1>
          <p className="text-xs text-[#706E6B] dark:text-[#A09D9A] mt-1">
            Realtime affiliate marketing conversion and outbound redirects telemetry.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isRefetching}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#EAE5D9] bg-white px-4 py-2.5 text-xs font-bold text-[#111111] hover:bg-[#F5F2EB] dark:border-[#2D2B2A] dark:bg-[#1A1A1A] dark:text-white transition"
        >
          <RefreshCw size={14} className={isRefetching ? "animate-spin" : ""} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* Primary Analytics Counter */}
      <div className="rounded-2xl border border-[#EAE5D9] bg-[#3E2723] p-6 text-white dark:border-[#2D2B2A] dark:bg-[#1C1510] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300 dark:text-[#C2B280] flex items-center gap-1.5">
            <MousePointerClick size={14} />
            <span>Outbound Click Tracker</span>
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight">
            {data.counts.clicks} <span className="text-lg font-normal text-gray-300">Total Redirects</span>
          </h2>
          <p className="text-xs text-gray-300">
            Total unique link clickouts across Amazon, Myntra, and Flipkart partners.
          </p>
        </div>

        <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-white select-none">
          <BarChart3 size={24} />
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.name}
              className="rounded-xl border border-[#EAE5D9] bg-white p-5 dark:border-[#2D2B2A] dark:bg-[#1A1A1A] transition-all flex items-center gap-4"
            >
              <div className={`h-12 w-12 rounded-lg flex items-center justify-center shrink-0 ${card.color}`}>
                <Icon size={22} />
              </div>
              <div>
                <span className="text-xs text-[#706E6B] dark:text-[#A09D9A] font-semibold">{card.name}</span>
                <h3 className="text-2xl font-bold text-[#111111] dark:text-[#FDFBF7] mt-0.5">
                  {card.value}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom telemetry lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Click events by retailer */}
        <div className="rounded-xl border border-[#EAE5D9] bg-white p-6 dark:border-[#2D2B2A] dark:bg-[#1A1A1A] space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#111111] dark:text-[#FDFBF7] border-b border-[#EAE5D9] pb-3 dark:border-[#2D2B2A]">
            Outbound Traffic by Store
          </h3>

          <div className="space-y-4">
            {data.clicksByStore.length === 0 ? (
              <p className="text-xs text-[#706E6B] dark:text-[#A09D9A] py-6 text-center">No store click telemetry found.</p>
            ) : (
              data.clicksByStore.map((store) => (
                <div key={store.storeName} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#111111] dark:text-[#FDFBF7]">{store.storeName}</span>
                    <span className="text-gray-400">{store._count.id} clicks</span>
                  </div>
                  {/* Progress bar simulation */}
                  <div className="h-2 w-full rounded-full bg-[#F5F2EB] dark:bg-[#111111] overflow-hidden">
                    <div 
                      className="h-full bg-[#8B5A2B] dark:bg-[#C2B280] rounded-full"
                      style={{ 
                        width: `${Math.min(100, (store._count.id / (data.counts.clicks || 1)) * 100)}%` 
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top converting products */}
        <div className="rounded-xl border border-[#EAE5D9] bg-white p-6 dark:border-[#2D2B2A] dark:bg-[#1A1A1A] space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#111111] dark:text-[#FDFBF7] border-b border-[#EAE5D9] pb-3 dark:border-[#2D2B2A]">
            Top Clicked Products
          </h3>

          <div className="divide-y divide-[#EAE5D9] dark:divide-[#2D2B2A]">
            {data.topProducts.length === 0 ? (
              <p className="text-xs text-[#706E6B] dark:text-[#A09D9A] py-6 text-center">No product clicks logged.</p>
            ) : (
              data.topProducts.map((prod, idx) => (
                <div key={idx} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                  <div className="space-y-0.5 pr-4">
                    <h4 className="text-xs font-bold text-[#111111] dark:text-[#FDFBF7] line-clamp-1">
                      {prod.title}
                    </h4>
                    <div className="flex items-center gap-1 text-[10px] text-amber-500">
                      <Star size={10} className="fill-current" />
                      <span className="font-bold text-gray-400">{prod.rating}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="rounded bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-800 dark:bg-amber-950/30 dark:text-amber-400">
                      {prod.clicks} Clicks
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
