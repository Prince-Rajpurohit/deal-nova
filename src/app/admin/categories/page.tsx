"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FolderOpen, Plus, Trash2, Loader2, PlusCircle, CheckCircle } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  _count?: {
    products: number;
    deals: number;
    blogs: number;
  };
}

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Get categories list
  const { data: categories, isLoading, isError } = useQuery<Category[]>({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const res = await fetch("/api/admin/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
  });

  // Create Category mutation
  const createMutation = useMutation({
    mutationFn: async (newCategory: any) => {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create category");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      setName("");
      setSlug("");
      setDescription("");
      setImage("");
      setSuccessMsg("Category created successfully!");
      setErrorMsg("");
      setTimeout(() => setSuccessMsg(""), 4000);
    },
    onError: (err: any) => {
      setErrorMsg(err.message || "Failed to create category");
      setSuccessMsg("");
    },
  });

  // Delete Category mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete category");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    // Generate auto slug
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;
    createMutation.mutate({ name, slug, description, image });
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
          Categories Management
        </h1>
        <p className="text-xs text-[#706E6B] dark:text-[#A09D9A] mt-1">
          Add, view, and organize product departments and coupon categories.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Creation Form (1 col) */}
        <div className="lg:col-span-1 rounded-xl border border-[#EAE5D9] bg-white p-6 dark:border-[#2D2B2A] dark:bg-[#1A1A1A] h-fit">
          <h3 className="font-serif text-lg font-bold text-[#111111] dark:text-[#FDFBF7] mb-6 flex items-center gap-2">
            <PlusCircle size={18} />
            <span>Add New Category</span>
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
                Category Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={handleNameChange}
                placeholder="e.g., Sneakers"
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
                placeholder="e.g., sneakers"
                className="w-full mt-1.5 rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-2.5 px-3 text-xs text-[#111111] placeholder-[#706E6B] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief category summary description..."
                className="w-full mt-1.5 rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-2.5 px-3 text-xs text-[#111111] placeholder-[#706E6B] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
                Image URL (Unsplash or Cloudinary)
              </label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="e.g., https://images.unsplash.com/..."
                className="w-full mt-1.5 rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-2.5 px-3 text-xs text-[#111111] placeholder-[#706E6B] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
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
                  <span>Create Category</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Categories List (2 cols) */}
        <div className="lg:col-span-2 rounded-xl border border-[#EAE5D9] bg-white p-6 dark:border-[#2D2B2A] dark:bg-[#1A1A1A]">
          <h3 className="font-serif text-lg font-bold text-[#111111] dark:text-[#FDFBF7] mb-6 border-b border-[#EAE5D9] pb-3 dark:border-[#2D2B2A]">
            Active Categories List
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#EAE5D9] dark:border-[#2D2B2A] text-gray-400 uppercase tracking-widest font-bold">
                  <th className="py-3 px-4">Image</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Slug</th>
                  <th className="py-3 px-4 text-center">Counts</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE5D9] dark:divide-[#2D2B2A]">
                {categories?.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#F5F2EB]/30 dark:hover:bg-[#111111]/30 transition">
                    <td className="py-3.5 px-4 shrink-0">
                      <div className="h-10 w-10 overflow-hidden rounded bg-gray-100 dark:bg-gray-800">
                        <img src={cat.image || ""} alt="" className="h-full w-full object-cover" />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#111111] dark:text-[#FDFBF7]">
                      {cat.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-400">
                      /{cat.slug}
                    </td>
                    <td className="py-3.5 px-4 text-center text-[10px] space-y-0.5">
                      <div className="text-gray-400">Products: <strong className="text-gray-500 dark:text-gray-300">{cat._count?.products || 0}</strong></div>
                      <div className="text-gray-400">Deals: <strong className="text-gray-500 dark:text-gray-300">{cat._count?.deals || 0}</strong></div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${cat.name}" category?`)) {
                            deleteMutation.mutate(cat.id);
                          }
                        }}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                        aria-label="Delete Category"
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
