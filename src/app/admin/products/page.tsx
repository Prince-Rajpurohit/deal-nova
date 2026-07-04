"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShoppingBag, Plus, Trash2, Loader2, PlusCircle, CheckCircle, ExternalLink } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

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
  categoryId: string;
  category: { name: string };
  affiliateLinks?: AffiliateLink[];
}

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imagesInput, setImagesInput] = useState("");
  const [priceOriginal, setPriceOriginal] = useState("");
  const [priceDiscounted, setPriceDiscounted] = useState("");
  const [rating, setRating] = useState("4.5");
  const [categoryId, setCategoryId] = useState("");
  
  // Custom arrays
  const [featuresInput, setFeaturesInput] = useState("");
  const [prosInput, setProsInput] = useState("");
  const [consInput, setConsInput] = useState("");
  
  // Multiple Affiliate links builder
  const [amazonUrl, setAmazonUrl] = useState("");
  const [amazonPrice, setAmazonPrice] = useState("");
  
  const [flipkartUrl, setFlipkartUrl] = useState("");
  const [flipkartPrice, setFlipkartPrice] = useState("");
  
  const [myntraUrl, setMyntraUrl] = useState("");
  const [myntraPrice, setMyntraPrice] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Get categories
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const res = await fetch("/api/admin/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
  });

  // Get products
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const res = await fetch("/api/admin/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (newProduct: any) => {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create product");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setTitle("");
      setSlug("");
      setDescription("");
      setImagesInput("");
      setPriceOriginal("");
      setPriceDiscounted("");
      setRating("4.5");
      setFeaturesInput("");
      setProsInput("");
      setConsInput("");
      setAmazonUrl("");
      setAmazonPrice("");
      setFlipkartUrl("");
      setFlipkartPrice("");
      setMyntraUrl("");
      setMyntraPrice("");
      setSuccessMsg("Product cataloged successfully!");
      setErrorMsg("");
      setTimeout(() => setSuccessMsg(""), 4000);
    },
    onError: (err: any) => {
      setErrorMsg(err.message || "Failed to catalog product");
      setSuccessMsg("");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete product");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !description || !categoryId || !priceDiscounted) return;

    // Build images array
    const imagesArray = imagesInput
      .split(",")
      .map((img) => img.trim())
      .filter((img) => img !== "");
    if (imagesArray.length === 0) {
      imagesArray.push("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80");
    }

    // Build features, pros, cons lists
    const features = featuresInput.split("\n").map((f) => f.trim()).filter((f) => f !== "");
    const pros = prosInput.split("\n").map((p) => p.trim()).filter((p) => p !== "");
    const cons = consInput.split("\n").map((c) => c.trim()).filter((c) => c !== "");

    // Build affiliate links list
    const affiliateLinks: AffiliateLink[] = [];
    if (amazonUrl) {
      affiliateLinks.push({
        storeName: "Amazon",
        url: amazonUrl,
        price: Number(amazonPrice) || Number(priceDiscounted),
        isPrimary: true, // Primary defaults to Amazon if set
      });
    }
    if (flipkartUrl) {
      affiliateLinks.push({
        storeName: "Flipkart",
        url: flipkartUrl,
        price: Number(flipkartPrice) || Number(priceDiscounted),
        isPrimary: affiliateLinks.length === 0,
      });
    }
    if (myntraUrl) {
      affiliateLinks.push({
        storeName: "Myntra",
        url: myntraUrl,
        price: Number(myntraPrice) || Number(priceDiscounted),
        isPrimary: affiliateLinks.length === 0,
      });
    }

    createMutation.mutate({
      title,
      slug,
      description,
      images: imagesArray,
      priceOriginal: Number(priceOriginal) || Number(priceDiscounted),
      priceDiscounted: Number(priceDiscounted),
      rating: Number(rating) || 4.5,
      features,
      pros,
      cons,
      isTopPick: true,
      categoryId,
      affiliateLinks,
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
          Products Management
        </h1>
        <p className="text-xs text-[#706E6B] dark:text-[#A09D9A] mt-1">
          Catalog premium goods and manage store affiliate reference links.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Panel (1 col) */}
        <div className="lg:col-span-1 rounded-xl border border-[#EAE5D9] bg-white p-6 dark:border-[#2D2B2A] dark:bg-[#1A1A1A] h-fit">
          <h3 className="font-serif text-lg font-bold text-[#111111] dark:text-[#FDFBF7] mb-6 flex items-center gap-2">
            <PlusCircle size={18} />
            <span>Catalog New Product</span>
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
                Product Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g., Nike Air Max Pulse"
                className="w-full mt-1.5 rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-2.5 px-3 text-xs text-[#111111] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
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
                placeholder="e.g., nike-air-max-pulse-beige"
                className="w-full mt-1.5 rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-2.5 px-3 text-xs text-[#111111] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
                  Original Price
                </label>
                <input
                  type="number"
                  value={priceOriginal}
                  onChange={(e) => setPriceOriginal(e.target.value)}
                  placeholder="13999"
                  className="w-full mt-1.5 rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-2.5 px-3 text-xs text-[#111111] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
                  Discounted Price
                </label>
                <input
                  type="number"
                  required
                  value={priceDiscounted}
                  onChange={(e) => setPriceDiscounted(e.target.value)}
                  placeholder="9799"
                  className="w-full mt-1.5 rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-2.5 px-3 text-xs text-[#111111] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
                />
              </div>
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
                  Rating (0-5)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  placeholder="4.8"
                  className="w-full mt-1.5 rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-2.5 px-3 text-xs text-[#111111] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
                Description
              </label>
              <textarea
                required
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product description overview details..."
                className="w-full mt-1.5 rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-2.5 px-3 text-xs text-[#111111] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
                Image URLs (Comma Separated)
              </label>
              <input
                type="text"
                value={imagesInput}
                onChange={(e) => setImagesInput(e.target.value)}
                placeholder="https://image1.jpg, https://image2.jpg"
                className="w-full mt-1.5 rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-2.5 px-3 text-xs text-[#111111] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
              />
            </div>

            {/* Pros/Cons arrays */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
                  Pros (Line Separated)
                </label>
                <textarea
                  rows={2}
                  value={prosInput}
                  onChange={(e) => setProsInput(e.target.value)}
                  placeholder="Extremely comfortable&#10;Sleek design"
                  className="w-full mt-1.5 rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-2 px-2 text-[10px] text-[#111111] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
                  Cons (Line Separated)
                </label>
                <textarea
                  rows={2}
                  value={consInput}
                  onChange={(e) => setConsInput(e.target.value)}
                  placeholder="Pricey&#10;Limited sizing"
                  className="w-full mt-1.5 rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-2 px-2 text-[10px] text-[#111111] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
                />
              </div>
            </div>

            {/* Partner Store Affiliate links form builder */}
            <div className="border-t border-[#EAE5D9] pt-4 mt-2 space-y-3 dark:border-[#2D2B2A]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B5A2B] dark:text-[#C2B280]">
                Partner Retail Links Builder
              </span>

              {/* Amazon */}
              <div className="grid grid-cols-3 gap-2 items-center">
                <span className="text-[10px] font-bold text-gray-500">Amazon</span>
                <input
                  type="text"
                  placeholder="URL link"
                  value={amazonUrl}
                  onChange={(e) => setAmazonUrl(e.target.value)}
                  className="col-span-2 rounded border border-[#EAE5D9] bg-[#F5F2EB] px-2 py-1 text-[10px] text-[#111111] dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
                />
              </div>

              {/* Flipkart */}
              <div className="grid grid-cols-3 gap-2 items-center">
                <span className="text-[10px] font-bold text-gray-500">Flipkart</span>
                <input
                  type="text"
                  placeholder="URL link"
                  value={flipkartUrl}
                  onChange={(e) => setFlipkartUrl(e.target.value)}
                  className="col-span-2 rounded border border-[#EAE5D9] bg-[#F5F2EB] px-2 py-1 text-[10px] text-[#111111] dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
                />
              </div>

              {/* Myntra */}
              <div className="grid grid-cols-3 gap-2 items-center">
                <span className="text-[10px] font-bold text-gray-500">Myntra</span>
                <input
                  type="text"
                  placeholder="URL link"
                  value={myntraUrl}
                  onChange={(e) => setMyntraUrl(e.target.value)}
                  className="col-span-2 rounded border border-[#EAE5D9] bg-[#F5F2EB] px-2 py-1 text-[10px] text-[#111111] dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
                />
              </div>
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
                  <span>Catalog Product</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Products list table (2 cols) */}
        <div className="lg:col-span-2 rounded-xl border border-[#EAE5D9] bg-white p-6 dark:border-[#2D2B2A] dark:bg-[#1A1A1A]">
          <h3 className="font-serif text-lg font-bold text-[#111111] dark:text-[#FDFBF7] mb-6 border-b border-[#EAE5D9] pb-3 dark:border-[#2D2B2A]">
            Cataloged Products ({products?.length || 0})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#EAE5D9] dark:border-[#2D2B2A] text-gray-400 uppercase tracking-widest font-bold">
                  <th className="py-3 px-4">Product Info</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Prices</th>
                  <th className="py-3 px-4">Affiliate Outlets</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE5D9] dark:divide-[#2D2B2A]">
                {products?.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#F5F2EB]/30 dark:hover:bg-[#111111]/30 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded bg-gray-100 dark:bg-gray-800 shrink-0">
                          <img src={prod.images[0] || ""} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#111111] dark:text-[#FDFBF7] line-clamp-1">{prod.title}</h4>
                          <span className="font-mono text-[10px] text-gray-400">/{prod.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 dark:text-gray-300">
                      {prod.category.name}
                    </td>
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="font-bold text-[#8B5A2B] dark:text-[#C2B280]">
                        {formatPrice(prod.priceDiscounted)}
                      </div>
                      {prod.priceOriginal > prod.priceDiscounted && (
                        <div className="text-[10px] text-gray-400 line-through">
                          {formatPrice(prod.priceOriginal)}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {prod.affiliateLinks && prod.affiliateLinks.length > 0 ? (
                          prod.affiliateLinks.map((link) => (
                            <span 
                              key={link.storeName}
                              className="inline-flex items-center gap-0.5 rounded bg-gray-100 px-1.5 py-0.5 text-[9px] font-bold text-gray-600 dark:bg-[#111111] dark:text-gray-400"
                            >
                              <span>{link.storeName}</span>
                              <span className="text-[#8B5A2B] dark:text-[#C2B280]">{formatPrice(link.price)}</span>
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-gray-400">No partner links configured</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${prod.title}"?`)) {
                            deleteMutation.mutate(prod.id);
                          }
                        }}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                        aria-label="Delete Product"
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
