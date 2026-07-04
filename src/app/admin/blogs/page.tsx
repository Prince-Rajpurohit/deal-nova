"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Plus, Trash2, Loader2, PlusCircle, CheckCircle } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  isPublished: boolean;
  viewCount: number;
  categoryId: string;
  category: { name: string };
  createdAt: string;
}

export default function AdminBlogsPage() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [categoryId, setCategoryId] = useState("");
  
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

  // Get blogs
  const { data: blogs, isLoading } = useQuery<Blog[]>({
    queryKey: ["admin-blogs"],
    queryFn: async () => {
      const res = await fetch("/api/admin/blogs");
      if (!res.ok) throw new Error("Failed to fetch blogs");
      return res.json();
    },
  });

  // Create blog post mutation
  const createMutation = useMutation({
    mutationFn: async (newBlog: any) => {
      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBlog),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create article");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      setTitle("");
      setSlug("");
      setExcerpt("");
      setContent("");
      setCoverImage("");
      setTagsInput("");
      setSuccessMsg("Blog post saved and published!");
      setErrorMsg("");
      setTimeout(() => setSuccessMsg(""), 4000);
    },
    onError: (err: any) => {
      setErrorMsg(err.message || "Failed to save article");
      setSuccessMsg("");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/blogs?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete article");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !excerpt || !content || !categoryId) return;

    const tagsArray = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");

    createMutation.mutate({
      title,
      slug,
      excerpt,
      content,
      coverImage,
      tags: tagsArray,
      categoryId,
      isPublished: true,
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
          Blogs CMS Dashboard
        </h1>
        <p className="text-xs text-[#706E6B] dark:text-[#A09D9A] mt-1">
          Compose style guides, review chronographs, and write gadget comparisons.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form panel (1 col) */}
        <div className="lg:col-span-1 rounded-xl border border-[#EAE5D9] bg-white p-6 dark:border-[#2D2B2A] dark:bg-[#1A1A1A] h-fit">
          <h3 className="font-serif text-lg font-bold text-[#111111] dark:text-[#FDFBF7] mb-6 flex items-center gap-2">
            <PlusCircle size={18} />
            <span>Write New Article</span>
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
                Article Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g., Best Sneakers under 500"
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
                placeholder="e.g., best-sneakers-under-500"
                className="w-full mt-1.5 rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-2.5 px-3 text-xs text-[#111111] placeholder-[#706E6B] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
                Topic Category
              </label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full mt-1.5 rounded-lg border border-[#EAE5D9] bg-[#FDFBF7] py-2.5 px-3 text-xs text-[#111111] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
              >
                <option value="">Select Topic</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
                Excerpt (Meta Description)
              </label>
              <textarea
                required
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary shown on listings card..."
                className="w-full mt-1.5 rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-2.5 px-3 text-xs text-[#111111] placeholder-[#706E6B] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
                Article Content (Supports Markdown Elements)
              </label>
              <textarea
                required
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="### Heading&#10;Write markdown content paragraphs here..."
                className="w-full mt-1.5 rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-2.5 px-3 text-xs font-mono text-[#111111] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
                Cover Image URL
              </label>
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full mt-1.5 rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-2.5 px-3 text-xs text-[#111111] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
                Tags (Comma Separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g., Styling, Sneakers, Deals"
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
                  <span>Publish Article</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Blogs CMS list (2 cols) */}
        <div className="lg:col-span-2 rounded-xl border border-[#EAE5D9] bg-white p-6 dark:border-[#2D2B2A] dark:bg-[#1A1A1A]">
          <h3 className="font-serif text-lg font-bold text-[#111111] dark:text-[#FDFBF7] mb-6 border-b border-[#EAE5D9] pb-3 dark:border-[#2D2B2A]">
            Current CMS Articles
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#EAE5D9] dark:border-[#2D2B2A] text-gray-400 uppercase tracking-widest font-bold">
                  <th className="py-3 px-4">Article Details</th>
                  <th className="py-3 px-4">Topic</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-center">Reads</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE5D9] dark:divide-[#2D2B2A]">
                {blogs?.map((blog) => (
                  <tr key={blog.id} className="hover:bg-[#F5F2EB]/30 dark:hover:bg-[#111111]/30 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex gap-3">
                        <div className="h-10 w-16 overflow-hidden rounded bg-gray-100 dark:bg-gray-800 shrink-0">
                          <img src={blog.coverImage} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#111111] dark:text-[#FDFBF7] line-clamp-1">{blog.title}</h4>
                          <span className="font-mono text-[10px] text-gray-400">/{blog.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 dark:text-gray-300">
                      {blog.category.name}
                    </td>
                    <td className="py-3.5 px-4 text-gray-400 whitespace-nowrap">
                      {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-[#8B5A2B] dark:text-[#C2B280]">
                      {blog.viewCount}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${blog.title}"?`)) {
                            deleteMutation.mutate(blog.id);
                          }
                        }}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                        aria-label="Delete Blog"
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
