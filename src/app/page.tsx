import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, TrendingUp, BadgePercent, Tag, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import CountdownTimer from "@/components/countdown-timer";
import NewsletterForm from "@/components/newsletter-form";
import { logAffiliateClick, formatPrice } from "@/lib/utils";
import {
  MOCK_CATEGORIES,
  MOCK_PRODUCTS,
  MOCK_DEALS,
  MOCK_BLOGS,
} from "@/lib/mock-data";

export default async function HomePage() {
  // Safe DB queries with mock fallbacks
  let categories = MOCK_CATEGORIES;
  let trendingDeals = MOCK_DEALS;
  let sneakersUnder500 = MOCK_PRODUCTS.filter(
    (p) => p.categoryId === "cat_sneakers" && p.priceDiscounted <= 500
  );
  let shirtsUnder999 = MOCK_PRODUCTS.filter(
    (p) => p.categoryId === "cat_fashion" && p.priceDiscounted <= 999
  );
  let budgetFashion = MOCK_PRODUCTS.filter((p) => p.categoryId === "cat_fashion");
  let gadgets = MOCK_PRODUCTS.filter((p) => p.categoryId === "cat_gadgets");
  let watches = MOCK_PRODUCTS.filter((p) => p.categoryId === "cat_watches");
  let popularBlogs = MOCK_BLOGS;

  try {
    const dbCategories = await prisma.category.findMany({ take: 6 });
    if (dbCategories.length > 0) categories = dbCategories as any;

    const dbTrendingDeals = await prisma.deal.findMany({
      where: { isFeatured: true },
      take: 4,
      include: { category: true },
    });
    if (dbTrendingDeals.length > 0) trendingDeals = dbTrendingDeals as any;

    const dbSneakers500 = await prisma.product.findMany({
      where: {
        category: { name: "Sneakers" },
        priceDiscounted: { lte: 500 },
      },
      take: 4,
      include: { category: true, affiliateLinks: true },
    });
    if (dbSneakers500.length > 0) sneakersUnder500 = dbSneakers500 as any;

    const dbShirts999 = await prisma.product.findMany({
      where: {
        category: { name: "Fashion" },
        priceDiscounted: { lte: 999 },
      },
      take: 4,
      include: { category: true, affiliateLinks: true },
    });
    if (dbShirts999.length > 0) shirtsUnder999 = dbShirts999 as any;

    const dbBudgetFashion = await prisma.product.findMany({
      where: { category: { name: "Fashion" } },
      take: 4,
      include: { category: true, affiliateLinks: true },
    });
    if (dbBudgetFashion.length > 0) budgetFashion = dbBudgetFashion as any;

    const dbGadgets = await prisma.product.findMany({
      where: { category: { name: "Gadgets" } },
      take: 4,
      include: { category: true, affiliateLinks: true },
    });
    if (dbGadgets.length > 0) gadgets = dbGadgets as any;

    const dbWatches = await prisma.product.findMany({
      where: { category: { name: "Watches" } },
      take: 4,
      include: { category: true, affiliateLinks: true },
    });
    if (dbWatches.length > 0) watches = dbWatches as any;

    const dbBlogs = await prisma.blog.findMany({
      where: { isPublished: true },
      orderBy: { viewCount: "desc" },
      take: 3,
      include: { category: true },
    });
    if (dbBlogs.length > 0) popularBlogs = dbBlogs as any;
  } catch (error) {
    console.warn("Database connection failed, falling back to mock seed data:", error);
  }

  // Find a product for the Hero Section
  const heroProduct = MOCK_PRODUCTS[0]; // Nike Air Max Pulse

  return (
    <>
      <Navbar />

      <main className="flex-grow bg-[#FDFBF7] dark:bg-[#111111] transition-colors duration-300">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden border-b border-[#EAE5D9] bg-[#F5F2EB] py-16 lg:py-24 dark:border-[#2D2B2A] dark:bg-[#151413]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
              
              {/* Hero Text */}
              <div className="space-y-6 text-center lg:text-left">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#3E2723] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#FDFBF7] dark:bg-[#C2B280] dark:text-[#111111]">
                  <Sparkles size={12} />
                  <span>Curated Premium Edits</span>
                </span>
                
                <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-[#111111] sm:text-5xl lg:text-6xl dark:text-[#FDFBF7]">
                  Discover Quiet Luxury At <span className="text-[#8B5A2B] dark:text-[#C2B280]">Unbelievable Values</span>
                </h1>
                
                <p className="mx-auto lg:mx-0 max-w-lg text-base leading-relaxed text-[#706E6B] dark:text-[#A09D9A]">
                  Deal Nova handles the hunt. We scour Amazon, Flipkart, and Myntra daily to curate luxury-inspired styles, elite watches, and must-have gadgets with direct affiliate benefits.
                </p>

                <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                  <Link
                    href="/category/fashion"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#3E2723] px-6 py-3 text-sm font-bold text-white hover:bg-[#8B5A2B] dark:bg-[#C2B280] dark:text-[#111111] dark:hover:bg-[#FDFBF7] transition-all"
                  >
                    <span>Browse Luxury Fashion</span>
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/deals"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#EAE5D9] bg-[#FDFBF7] px-6 py-3 text-sm font-bold text-[#111111] hover:bg-[#F5F2EB] dark:border-[#2D2B2A] dark:bg-[#1A1A1A] dark:text-white dark:hover:bg-[#111111] transition-all"
                  >
                    <span>Flash Deals Tracker</span>
                  </Link>
                </div>
              </div>

              {/* Hero Showcase Image */}
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="overflow-hidden rounded-2xl border border-[#EAE5D9] bg-[#FDFBF7] p-6 shadow-2xl dark:border-[#2D2B2A] dark:bg-[#1A1A1A] group">
                  <div className="aspect-video w-full overflow-hidden rounded-xl bg-[#F5F2EB] dark:bg-[#111111]">
                    <img
                      src={heroProduct.images[0]}
                      alt={heroProduct.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B5A2B] dark:text-[#C2B280]">
                        Top Pick of the Week
                      </span>
                      <h3 className="font-serif text-xl font-bold text-[#111111] dark:text-[#FDFBF7]">
                        {heroProduct.title}
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400 line-through">
                        {formatPrice(heroProduct.priceOriginal)}
                      </div>
                      <div className="text-xl font-extrabold text-[#8B5A2B] dark:text-[#C2B280]">
                        {formatPrice(heroProduct.priceDiscounted)}
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-[#706E6B] dark:text-[#A09D9A] line-clamp-2">
                    {heroProduct.description}
                  </p>
                  <div className="mt-6 border-t border-[#EAE5D9] pt-4 dark:border-[#2D2B2A] flex justify-end">
                    <Link
                      href={`/product/${heroProduct.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#8B5A2B] hover:underline dark:text-[#C2B280]"
                    >
                      <span>Check Price Comparisons</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* CATEGORIES BAR */}
        <section className="border-b border-[#EAE5D9] py-8 dark:border-[#2D2B2A]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between overflow-x-auto gap-6 no-scrollbar pb-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="flex items-center gap-3.5 rounded-full border border-[#EAE5D9] bg-white px-5 py-3 text-xs font-bold text-[#111111] shadow-sm hover:border-[#8B5A2B] dark:border-[#2D2B2A] dark:bg-[#1A1A1A] dark:text-[#FDFBF7] dark:hover:border-[#C2B280] transition-all whitespace-nowrap"
                >
                  <span className="relative flex h-5 w-5 overflow-hidden rounded-full">
                    <img src={cat.image || ""} alt="" className="object-cover" />
                  </span>
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* TRENDING DEALS FLASH */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                  <TrendingUp size={16} />
                  <span>Trending Flash Deals</span>
                </span>
                <h2 className="mt-1 font-serif text-3xl font-bold text-[#111111] dark:text-[#FDFBF7]">
                  Active Discounts & Promo Codes
                </h2>
              </div>
              <Link
                href="/deals"
                className="inline-flex items-center gap-1 text-sm font-bold text-[#8B5A2B] hover:underline dark:text-[#C2B280]"
              >
                <span>View All Deals</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {trendingDeals.map((deal) => {
                const percentage = Math.round(deal.discountPercentage);
                return (
                  <div
                    key={deal.id}
                    className="group relative overflow-hidden rounded-2xl border border-[#EAE5D9] bg-[#FDFBF7] p-5 dark:border-[#2D2B2A] dark:bg-[#1A1A1A] hover:shadow-lg transition-all"
                  >
                    <div className="flex gap-4">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-[#F5F2EB] dark:bg-[#111111]">
                        <img
                          src={deal.image || ""}
                          alt=""
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex flex-col justify-between">
                        <span className="inline-flex max-w-max rounded bg-red-100 px-2 py-0.5 text-[9px] font-bold text-red-800 dark:bg-red-950/30 dark:text-red-400">
                          {percentage}% OFF
                        </span>
                        <h3 className="font-serif text-base font-bold text-[#111111] dark:text-[#FDFBF7] line-clamp-1">
                          {deal.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#8B5A2B] dark:text-[#C2B280]">
                            {formatPrice(deal.dealPrice)}
                          </span>
                          <span className="text-xs text-gray-400 line-through">
                            {formatPrice(deal.originalPrice)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-[#706E6B] dark:text-[#A09D9A] line-clamp-2">
                      {deal.description}
                    </p>

                    <div className="mt-5 border-t border-[#EAE5D9] pt-4 dark:border-[#2D2B2A] flex flex-wrap items-center justify-between gap-4">
                      {deal.endsAt && <CountdownTimer endsAt={deal.endsAt} />}
                      <a
                        href={deal.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded bg-[#3E2723] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#8B5A2B] dark:bg-[#C2B280] dark:text-[#111111] transition-all ml-auto"
                      >
                        <span>Grab Deal on {deal.storeName}</span>
                        <ArrowRight size={10} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* BEST SNEAKERS UNDER 500 */}
        <section className="bg-[#F5F2EB] py-16 sm:py-24 dark:bg-[#151413] border-y border-[#EAE5D9] dark:border-[#2D2B2A]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#8B5A2B] dark:text-[#C2B280]">
                  <Tag size={12} />
                  <span>Steal Deals</span>
                </span>
                <h2 className="mt-1 font-serif text-3xl font-bold text-[#111111] dark:text-[#FDFBF7]">
                  Best Sneakers Under ₹500
                </h2>
              </div>
              <Link
                href="/category/sneakers"
                className="inline-flex items-center gap-1 text-sm font-bold text-[#8B5A2B] hover:underline dark:text-[#C2B280]"
              >
                <span>Browse Sneakers</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {sneakersUnder500.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          </div>
        </section>

        {/* BEST SHIRTS UNDER 999 */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#8B5A2B] dark:text-[#C2B280]">
                  <BadgePercent size={12} />
                  <span>Budget Styling</span>
                </span>
                <h2 className="mt-1 font-serif text-3xl font-bold text-[#111111] dark:text-[#FDFBF7]">
                  Best Shirts Under ₹999
                </h2>
              </div>
              <Link
                href="/category/fashion"
                className="inline-flex items-center gap-1 text-sm font-bold text-[#8B5A2B] hover:underline dark:text-[#C2B280]"
              >
                <span>Browse Fashion</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {shirtsUnder999.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          </div>
        </section>

        {/* CURATED LUXURY GADGETS */}
        <section className="bg-[#F5F2EB] py-16 sm:py-24 dark:bg-[#151413] border-y border-[#EAE5D9] dark:border-[#2D2B2A]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="font-serif text-3xl font-bold text-[#111111] dark:text-[#FDFBF7]">
                  Gadgets Worth Buying
                </h2>
                <p className="text-xs text-[#706E6B] dark:text-[#A09D9A] mt-1">
                  Tested and verified tech accessories that deliver peak value.
                </p>
              </div>
              <Link
                href="/category/gadgets"
                className="inline-flex items-center gap-1 text-sm font-bold text-[#8B5A2B] hover:underline dark:text-[#C2B280]"
              >
                <span>Browse Gadgets</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {gadgets.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED WATCHES */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="font-serif text-3xl font-bold text-[#111111] dark:text-[#FDFBF7]">
                  Featured Chronographs & Watches
                </h2>
                <p className="text-xs text-[#706E6B] dark:text-[#A09D9A] mt-1">
                  Upgrade your wrist game with mechanical movements and design-focused chronos.
                </p>
              </div>
              <Link
                href="/category/watches"
                className="inline-flex items-center gap-1 text-sm font-bold text-[#8B5A2B] hover:underline dark:text-[#C2B280]"
              >
                <span>Browse Watches</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {watches.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          </div>
        </section>

        {/* MOST POPULAR BLOGS */}
        <section className="bg-[#F5F2EB] py-16 sm:py-24 dark:bg-[#151413] border-t border-[#EAE5D9] dark:border-[#2D2B2A]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="font-serif text-3xl font-bold text-[#111111] dark:text-[#FDFBF7]">
                  Most Popular Articles
                </h2>
                <p className="text-xs text-[#706E6B] dark:text-[#A09D9A] mt-1">
                  Read styling advice, buying guides, and tech breakdowns.
                </p>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1 text-sm font-bold text-[#8B5A2B] hover:underline dark:text-[#C2B280]"
              >
                <span>View All Articles</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {popularBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#EAE5D9] bg-[#FDFBF7] dark:border-[#2D2B2A] dark:bg-[#1A1A1A] hover:shadow-lg transition-all"
                >
                  <div className="aspect-video overflow-hidden bg-[#F5F2EB] dark:bg-[#111111]">
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B5A2B] dark:text-[#C2B280] mb-2">
                      {blog.category?.name || "Style"}
                    </span>
                    <Link href={`/blog/${blog.slug}`} className="hover:underline">
                      <h3 className="font-serif text-lg font-bold text-[#111111] dark:text-[#FDFBF7] line-clamp-2 leading-snug">
                        {blog.title}
                      </h3>
                    </Link>
                    <p className="mt-3 text-xs leading-relaxed text-[#706E6B] dark:text-[#A09D9A] line-clamp-3">
                      {blog.excerpt}
                    </p>
                    <div className="mt-auto pt-6 flex items-center justify-between text-xs font-bold text-[#8B5A2B] dark:text-[#C2B280]">
                      <Link href={`/blog/${blog.slug}`} className="inline-flex items-center gap-1 hover:underline">
                        <span>Read Article</span>
                        <ArrowRight size={12} />
                      </Link>
                      <span className="text-[10px] text-gray-400 font-normal">
                        {blog.viewCount} reads
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EMAIL SUBSCRIPTION */}
        <section className="py-16 sm:py-24 border-t border-[#EAE5D9] dark:border-[#2D2B2A]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <NewsletterForm />
          </div>
        </section>
        
        {/* TRUST BANNER */}
        <section className="bg-[#1A1A1A] py-10 text-[#FDFBF7] dark:bg-[#0A0A0A] border-t border-[#2D2B2A]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#C2B280] text-[#111111] shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-[#C2B280]">100% Curated Picks</h4>
                <p className="text-xs text-[#A09D9A] mt-0.5">Every recommendation is analyzed, reviewed and compared.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#C2B280] text-[#111111] shrink-0">
                <BadgePercent size={20} />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-[#C2B280]">Best Available Offers</h4>
                <p className="text-xs text-[#A09D9A] mt-0.5">We track and surface daily flash promotions instantly.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#C2B280] text-[#111111] shrink-0">
                <Sparkles size={20} />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-[#C2B280]">Quiet Luxury Vibe</h4>
                <p className="text-xs text-[#A09D9A] mt-0.5">Designed to offer clean premium aesthetics on a budget.</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
