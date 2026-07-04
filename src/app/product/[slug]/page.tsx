import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductClient from "@/components/product-client";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // Safe fetch with static fallback
  let product = MOCK_PRODUCTS.find((p) => p.slug === slug);
  let relatedProducts = MOCK_PRODUCTS.filter(
    (p) => p.categoryId === product?.categoryId && p.id !== product?.id
  );

  try {
    const dbProduct = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: { select: { name: true } },
        affiliateLinks: true,
      },
    });

    if (dbProduct) {
      product = dbProduct as any;
      
      const dbRelated = await prisma.product.findMany({
        where: {
          categoryId: dbProduct.categoryId,
          id: { not: dbProduct.id },
        },
        take: 4,
        include: {
          category: { select: { name: true } },
          affiliateLinks: true,
        },
      });
      if (dbRelated.length > 0) {
        relatedProducts = dbRelated as any;
      }
    }
  } catch (error) {
    console.warn(`Prisma product query failed for slug "${slug}", falling back to mock data:`, error);
  }

  if (!product) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <main className="flex-grow bg-[#FDFBF7] py-12 dark:bg-[#111111] transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <ProductClient
            product={product as any}
            relatedProducts={relatedProducts as any}
          />

        </div>
      </main>

      <Footer />
    </>
  );
}
