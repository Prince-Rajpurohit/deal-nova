"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tag, Plus, Trash2, Loader2, PlusCircle, CheckCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

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

export default function AdminDealsPage() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [dealPrice, setDealPrice] = useState("");
  const [storeName, setStoreName] = useState("Amazon");
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [endsAt, setEndsAt] = useState("");
  
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Get categories for select field
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const res = await fetch("/api/admin/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
  });

  // Get deals
  const { data: deals, isLoading } = useQuery<Deal[]>({
    queryKey: ["admin-deals"],
    queryFn: async () => {
      const res = await fetch("/api/admin/deals");
      if (!res.ok) throw new Error("Failed to fetch deals");
      return res.json();
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (newDeal: any) => {
      const res = await fetch("/api/admin/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDeal),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create deal");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-deals"] });
      setTitle("");
      setSlug("");
      setDescription("");
      setImage("");
      setDiscountPercentage("");
      setOriginalPrice("");
      setDealPrice("");
      setAffiliateUrl("");
      setEndsAt("");
      setSuccessMsg("Flash Deal saved successfully!");
      setErrorMsg("");
      setTimeout(() => setSuccessMsg(""), 4000);
    },
    onError: (err: any) => {
      setErrorMsg(err.message || "Failed to save deal");
      setSuccessMsg("");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/deals?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete deal");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-deals"] });
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
  };

  const handlePriceChange = (orig: string, discounted: string) => {
    const origNum = Number(orig);
    const discNum = Number(discounted);
    if (origNum > 0 && discNum > 0) {
      setDiscountPercentage(Math.round(((origNum - discNum) / origNum) * 100).toString());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !dealPrice || !storeName || !affiliateUrl || !categoryId) return;

    createMutation.mutate({
      title,
      slug,
      description,
      image,
      discountPercentage: Number(discountPercentage) || 0,
      originalPrice: Number(originalPrice) || 0,
      dealPrice: Number(dealPrice),
      storeName,
      affiliateUrl,
      endsAt: endsAt || null,
      categoryId,
      isFeatured: true,
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#8B5A2B] dark:text-[#C2B280]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#111111] dark:text-[#FDFBF7]">
          Flash Deals Tracker
        </h1>
        <p className="text-xs text-[#706E6B] dark:text-[#A09D9A] mt-1">
          Manage dynamic countdown deals and store coupon codes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Panel (1 col) */}
        <div className="lg:col-span-1 rounded-xl border border-[#EAE5D9] bg-white p-6 dark:border-[#2D2B2A] dark:bg-[#1A1A1A] h-fit">
          <h3 className="font-serif text-lg font-bold text-[#111111] dark:text-[#FDFBF7] mb-6 flex items-center gap-2">
            <PlusCircle size={18} />
            <span>Create New Deal</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-600 dark:bg-red-950/20 dark:text-red-400">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="rounded-lg bg-green-50 p-3 text-xs font-semibold text-green-600 dark:bg-green-950/20 dark:text-green-400 flex items-center gap-1.5">
                <CheckCircle size={14} />
                <span>{successMsg}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
                Deal Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g., Fossil Gen 6 Flat 45% OFF"
                className="w-full mt-1.5 rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-2.5 px-3 text-xs text-[#111111] placeholder-[#706E6B] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
                Slug (URL Path)
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g., flat-45-off-fossil-gen6"
                className="w-full mt-1.5 rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-2.5 px-3 text-xs text-[#111111] placeholder-[#706E6B] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
                  Original Price
                </label>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => {
                    setOriginalPrice(e.target.value);
                    handlePriceChange(e.target.value, dealPrice);
                  }}
                  placeholder="24995"
                  className="w-full mt-1.5 rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-2.5 px-3 text-xs text-[#111111] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
                  Deal Price
                </label>
                <input
                  type="number"
                  required
                  value={dealPrice}
                  onChange={(e) => {
                    setDealPrice(e.target.value);
                    handlePriceChange(originalPrice, e.target.value);
                  }}
                  placeholder="13747"
                  className="w-full mt-1.5 rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-2.5 px-3 text-xs text-[#111111] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
                  Discount %
                </label>
                <input
                  type="number"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                  placeholder="45"
                  className="w-full mt-1.5 rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-2.5 px-3 text-xs text-[#111111] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
                />
              </div>
              
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
                  Partner Store
                </label>
                <select
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full mt-1.5 rounded-lg border border-[#EAE5D9] bg-[#FDFBF7] py-2.5 px-3 text-xs text-[#111111] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
                >
                  <option value="Amazon">Amazon</option>
                  <option value="Flipkart">Flipkart</option>
                  <option value="Myntra">Myntra</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
                Affiliate Redirect URL
              </label>
              <input
                type="text"
                required
                value={affiliateUrl}
                onChange={(e) => setAffiliateUrl(e.target.value)}
                placeholder="e.g., https://amazon.in/dp/..."
                className="w-full mt-1.5 rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-2.5 px-3 text-xs text-[#111111] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
                  Category
                </label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full mt-1.5 rounded-lg border border-[#EAE5D9] bg-[#FDFBF7] py-2.5 px-3 text-xs text-[#111111] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
                >
                  <option value="">Select Category</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
                  Ends At Date/Time
                </label>
                <input
                  type="datetime-local"
                  value={endsAt}
                  onChange={(e) => setEndsAt(e.target.value)}
                  className="w-full mt-1.5 rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-2.5 px-3 text-xs text-[#111111] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
                Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Discount details..."
                className="w-full mt-1.5 rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-2.5 px-3 text-xs text-[#111111] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
                Cover Image URL
              </label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full mt-1.5 rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-2.5 px-3 text-xs text-[#111111] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#3E2723] py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#8B5A2B] dark:bg-[#C2B280] dark:text-[#111111] dark:hover:bg-[#FDFBF7] disabled:opacity-60 transition-all mt-4"
            >
              {createMutation.isPending ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Plus size={14} />
                  <span>Save Flash Deal</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Deals list table (2 cols) */}
        <div className="lg:col-span-2 rounded-xl border border-[#EAE5D9] bg-white p-6 dark:border-[#2D2B2A] dark:bg-[#1A1A1A]">
          <h3 className="font-serif text-lg font-bold text-[#111111] dark:text-[#FDFBF7] mb-6 border-b border-[#EAE5D9] pb-3 dark:border-[#2D2B2A]">
            Current Deals Tracker
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#EAE5D9] dark:border-[#2D2B2A] text-gray-400 uppercase tracking-widest font-bold">
                  <th className="py-3 px-4">Deal</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Prices</th>
                  <th className="py-3 px-4">Retailer</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE5D9] dark:divide-[#2D2B2A]">
                {deals?.map((deal) => (
                  <tr key={deal.id} className="hover:bg-[#F5F2EB]/30 dark:hover:bg-[#111111]/30 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded bg-gray-100 dark:bg-gray-800 shrink-0">
                          <img src={deal.image || ""} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#111111] dark:text-[#FDFBF7] line-clamp-1">{deal.title}</h4>
                          <span className="font-mono text-[10px] text-gray-400">/{deal.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 dark:text-gray-300">
                      {deal.category.name}
                    </td>
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="font-bold text-[#8B5A2B] dark:text-[#C2B280]">
                        {formatPrice(deal.dealPrice)}
                      </div>
                      {deal.originalPrice > 0 && (
                        <div className="text-[10px] text-gray-400 line-through">
                          {formatPrice(deal.originalPrice)}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-400">
                      {deal.storeName}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Remove "${deal.title}" deal link?`)) {
                            deleteMutation.mutate(deal.id);
                          }
                        }}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                        aria-label="Delete Deal"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
