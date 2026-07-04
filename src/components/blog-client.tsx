"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Calendar, User, Eye, ArrowRight } from "lucide-react";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  viewCount: number;
  categoryId: string;
  category: { name: string };
  createdAt: string;
}

interface BlogClientProps {
  blogs: Blog[];
  categories: Array<{ id: string; name: string }>;
}

export default function BlogClient({ blogs, categories }: BlogClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredBlogs = useMemo(() => {
    let result = [...blogs];

    // Search filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.excerpt.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((b) => b.categoryId === selectedCategory);
    }

    return result;
  }, [blogs, searchQuery, selectedCategory]);

  return (
    <div className="space-y-10">
      
      {/* Search & Category Filter chips */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-[#EAE5D9] pb-6 dark:border-[#2D2B2A]">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search size={16} className="absolute left-3 text-[#706E6B] dark:text-[#A09D9A]" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-2 pl-9 pr-4 text-xs text-[#111111] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
          />
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-full pb-1 self-start md:self-center">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              selectedCategory === "all"
                ? "bg-[#3E2723] text-white dark:bg-[#C2B280] dark:text-[#111111]"
                : "border border-[#EAE5D9] bg-white text-[#706E6B] dark:border-[#2D2B2A] dark:bg-[#1A1A1A] dark:text-[#A09D9A]"
            }`}
          >
            All Topics
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? "bg-[#3E2723] text-white dark:bg-[#C2B280] dark:text-[#111111]"
                  : "border border-[#EAE5D9] bg-white text-[#706E6B] dark:border-[#2D2B2A] dark:bg-[#1A1A1A] dark:text-[#A09D9A]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid articles listing */}
      {filteredBlogs.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#EAE5D9] rounded-2xl dark:border-[#2D2B2A]">
          <h3 className="font-serif text-lg font-bold text-[#111111] dark:text-[#FDFBF7]">
            No Articles Found
          </h3>
          <p className="text-xs text-[#706E6B] dark:text-[#A09D9A] mt-2">
            Try adjusting your search query or picking another topic chip.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((blog) => (
            <article
              key={blog.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#EAE5D9] bg-white dark:border-[#2D2B2A] dark:bg-[#1A1A1A] hover:shadow-lg transition-all"
            >
              <div className="aspect-video w-full overflow-hidden bg-[#F5F2EB] dark:bg-[#111111] relative">
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
              </div>

              <div className="flex flex-1 flex-col p-6 space-y-3">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#8B5A2B] dark:text-[#C2B280]">
                  {blog.category.name}
                </span>

                <Link href={`/blog/${blog.slug}`} className="hover:underline">
                  <h3 className="font-serif text-xl font-bold leading-snug text-[#111111] dark:text-[#FDFBF7] line-clamp-2">
                    {blog.title}
                  </h3>
                </Link>

                <p className="text-xs leading-relaxed text-[#706E6B] dark:text-[#A09D9A] line-clamp-3">
                  {blog.excerpt}
                </p>

                {/* Metadata */}
                <div className="mt-auto pt-6 border-t border-[#EAE5D9] dark:border-[#2D2B2A] flex items-center justify-between text-[10px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={12} />
                    <span>{blog.viewCount} views</span>
                  </span>
                </div>

                <div className="pt-2 flex justify-end">
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#8B5A2B] hover:underline dark:text-[#C2B280]"
                  >
                    <span>Read Article</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

    </div>
  );
}
