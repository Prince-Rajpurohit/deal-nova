import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, User, Eye, ArrowLeft, Tag, Share2, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import NewsletterForm from "@/components/newsletter-form";
import { MOCK_BLOGS, MOCK_PRODUCTS } from "@/lib/mock-data";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;

  // Safe DB fetch with fallbacks
  let blog = MOCK_BLOGS.find((b) => b.slug === slug);
  let recommendedProducts = MOCK_PRODUCTS.filter((p) => p.categoryId === blog?.categoryId);

  try {
    const dbBlog = await prisma.blog.findUnique({
      where: { slug },
      include: {
        category: { select: { name: true } },
      },
    });

    if (dbBlog) {
      blog = dbBlog as any;
      
      // Increment views count silently in background
      try {
        await prisma.blog.update({
          where: { id: dbBlog.id },
          data: { viewCount: { increment: 1 } },
        });
      } catch (err) {
        console.warn("Could not increment blog viewCount:", err);
      }

      const dbProducts = await prisma.product.findMany({
        where: { categoryId: dbBlog.categoryId },
        take: 3,
        include: {
          category: { select: { name: true } },
          affiliateLinks: true,
        },
      });
      if (dbProducts.length > 0) {
        recommendedProducts = dbProducts as any;
      }
    }
  } catch (error) {
    console.warn(`Prisma blog query failed for slug "${slug}", falling back to mock data:`, error);
  }

  if (!blog) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <main className="flex-grow bg-[#FDFBF7] py-12 dark:bg-[#111111] transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Back button */}
          <div className="mb-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#8B5A2B] hover:underline dark:text-[#C2B280]"
            >
              <ArrowLeft size={12} />
              <span>Back to Journal</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            
            {/* Main Content (2 cols) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Cover Image */}
              <div className="aspect-video w-full overflow-hidden rounded-2xl border border-[#EAE5D9] bg-[#F5F2EB] dark:border-[#2D2B2A] dark:bg-[#1A1A1A]">
                <img src={blog.coverImage} alt={blog.title} className="h-full w-full object-cover" />
              </div>

              {/* Title & Metadata */}
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAE5D9] px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#3E2723] dark:bg-[#2D2B2A] dark:text-[#C2B280]">
                  <Sparkles size={10} />
                  <span>{blog.category?.name || "Curation"}</span>
                </span>
                
                <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-[#111111] dark:text-[#FDFBF7]">
                  {blog.title}
                </h1>

                <div className="flex flex-wrap gap-4 text-xs text-gray-400 pt-2 border-b border-[#EAE5D9] pb-4 dark:border-[#2D2B2A]">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{new Date(blog.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <User size={14} />
                    <span>Deal Nova Editors</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye size={14} />
                    <span>{blog.viewCount} views</span>
                  </span>
                </div>
              </div>

              {/* Article Content Body */}
              <div className="prose max-w-none text-[#111111] dark:text-[#FDFBF7] text-sm leading-relaxed space-y-6">
                {blog.content.split("\n\n").map((para, idx) => {
                  if (para.startsWith("### ")) {
                    return (
                      <h3 key={idx} className="font-serif text-xl font-bold text-[#8B5A2B] dark:text-[#C2B280] pt-4">
                        {para.replace("### ", "")}
                      </h3>
                    );
                  }
                  if (para.startsWith("#### ")) {
                    return (
                      <h4 key={idx} className="font-serif text-base font-bold text-[#111111] dark:text-[#FDFBF7] pt-2">
                        {para.replace("#### ", "")}
                      </h4>
                    );
                  }
                  if (para.startsWith("* **")) {
                    return (
                      <ul key={idx} className="list-disc pl-5 space-y-2 text-xs text-[#706E6B] dark:text-[#A09D9A]">
                        {para.split("\n").map((bullet, bIdx) => (
                          <li key={bIdx}>
                            {bullet.replace("* ", "")}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={idx} className="text-sm leading-relaxed text-[#706E6B] dark:text-[#A09D9A]">
                      {para}
                    </p>
                  );
                })}
              </div>

            </div>

            {/* Sidebar (1 col) */}
            <div className="space-y-8 lg:sticky lg:top-24 max-h-[90vh] overflow-y-auto pr-2">
              
              {/* Tags panel */}
              {blog.tags.length > 0 && (
                <div className="rounded-xl border border-[#EAE5D9] bg-[#F5F2EB] p-5 dark:border-[#2D2B2A] dark:bg-[#1A1A1A]">
                  <h4 className="font-serif text-sm font-bold text-[#111111] dark:text-[#FDFBF7] mb-3.5 flex items-center gap-1.5">
                    <Tag size={14} />
                    <span>Article Tags</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-white px-2.5 py-1 text-[10px] font-bold text-[#706E6B] dark:bg-[#111111] dark:text-[#A09D9A]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Mentioned Products (Direct Conversion Layout!) */}
              {recommendedProducts.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-serif text-base font-bold text-[#111111] dark:text-[#FDFBF7] border-b border-[#EAE5D9] pb-3 dark:border-[#2D2B2A]">
                    Mentioned Collections
                  </h4>
                  <div className="space-y-6">
                    {recommendedProducts.map((prod) => (
                      <ProductCard key={prod.id} product={prod as any} />
                    ))}
                  </div>
                </div>
              )}

              {/* Mini Newsletter Sign-up */}
              <div className="rounded-xl border border-[#EAE5D9] bg-white p-5 dark:border-[#2D2B2A] dark:bg-[#1A1A1A]">
                <h4 className="font-serif text-sm font-bold text-[#111111] dark:text-[#FDFBF7] mb-2">
                  Love this content?
                </h4>
                <p className="text-[11px] text-[#706E6B] dark:text-[#A09D9A] mb-4">
                  Subscribe to receive our weekly luxury digests in your inbox.
                </p>
                <NewsletterForm />
              </div>

            </div>

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
