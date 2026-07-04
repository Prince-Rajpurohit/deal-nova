import React from "react";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import BlogClient from "@/components/blog-client";
import { MOCK_BLOGS, MOCK_CATEGORIES } from "@/lib/mock-data";

export const metadata = {
  title: "Style & Gear Guides | Deal Nova Blog",
  description: "Read curated guides on matching minimalist earth tones, watches buying advice, and high-value gadget reviews.",
};

export default async function BlogPage() {
  // Safe DB fetch with mock fallbacks
  let blogs = MOCK_BLOGS;
  let categories = MOCK_CATEGORIES;

  try {
    const dbCategories = await prisma.category.findMany({ select: { id: true, name: true } });
    if (dbCategories.length > 0) {
      categories = dbCategories as any;
    }

    const dbBlogs = await prisma.blog.findMany({
      where: { isPublished: true },
      include: {
        category: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    if (dbBlogs.length > 0) {
      blogs = dbBlogs as any;
    }
  } catch (error) {
    console.warn("Prisma blog query failed, falling back to mock blogs:", error);
  }

  return (
    <>
      <Navbar />

      <main className="flex-grow bg-[#FDFBF7] py-12 dark:bg-[#111111] transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="mb-12 border-b border-[#EAE5D9] pb-8 dark:border-[#2D2B2A] text-center lg:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8B5A2B] dark:text-[#C2B280]">
              Style & Tech CMS
            </span>
            <h1 className="mt-2 font-serif text-4xl font-bold text-[#111111] dark:text-[#FDFBF7]">
              The Deal Nova Journal
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#706E6B] dark:text-[#A09D9A]">
              In-depth reviews, wardrobe construction manuals, and price analysis guides written by our lifestyle curation editors.
            </p>
          </div>

          <BlogClient
            blogs={blogs as any}
            categories={categories as any}
          />

        </div>
      </main>

      <Footer />
    </>
  );
}
