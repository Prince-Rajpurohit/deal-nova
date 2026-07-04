import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CategoryClient from "@/components/category-client";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "@/lib/mock-data";

export async function generateStaticParams() {
  // Return pre-configured static categories for optimization
  return [
    { slug: "fashion" },
    { slug: "sneakers" },
    { slug: "watches" },
    { slug: "gadgets" },
    { slug: "home-essentials" },
    { slug: "daily-deals" },
  ];
}

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  
  // Safe fetch with static fallback
  let category = MOCK_CATEGORIES.find((cat) => cat.slug === slug);
  let products = MOCK_PRODUCTS.filter((p) => {
    const parentCategory = MOCK_CATEGORIES.find((c) => c.id === p.categoryId);
    return parentCategory?.slug === slug;
  });

  try {
    const dbCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (dbCategory) {
      category = dbCategory as any;
      const dbProducts = await prisma.product.findMany({
        where: { categoryId: dbCategory.id },
        include: {
          category: { select: { name: true } },
          affiliateLinks: true,
        },
      });
      if (dbProducts.length > 0) {
        products = dbProducts as any;
      }
    }
  } catch (error) {
    console.warn(`Prisma category query failed for slug "${slug}", falling back to mock data:`, error);
  }

  if (!category) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <main className="flex-grow bg-[#FDFBF7] py-12 dark:bg-[#111111] transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Category Info Header */}
          <div className="mb-12 border-b border-[#EAE5D9] pb-8 dark:border-[#2D2B2A] text-center lg:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8B5A2B] dark:text-[#C2B280]">
              Category Collection
            </span>
            <h1 className="mt-2 font-serif text-4xl font-bold text-[#111111] dark:text-[#FDFBF7]">
              {category.name}
            </h1>
            {category.description && (
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#706E6B] dark:text-[#A09D9A]">
                {category.description}
              </p>
            )}
          </div>

          {/* Interactive Filtering and Grid client wrapper */}
          <CategoryClient
            categoryName={category.name}
            categoryDescription={category.description || ""}
            products={products as any}
          />

        </div>
      </main>

      <Footer />
    </>
  );
}
