import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { MOCK_PRODUCTS, MOCK_BLOGS, MOCK_CATEGORIES } from "@/lib/mock-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://dealnova.com";

  // Base paths
  const staticPaths = [
    "",
    "/deals",
    "/blog",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/disclosure",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: path === "" ? 1.0 : 0.8,
  }));

  // Fetch dynamic categories
  let categoriesSlugs = MOCK_CATEGORIES.map((c) => c.slug);
  try {
    const dbCats = await prisma.category.findMany({ select: { slug: true } });
    if (dbCats.length > 0) {
      categoriesSlugs = dbCats.map((c) => c.slug);
    }
  } catch (e) {
    console.warn("Could not query categories for sitemap, using fallback static parameters:", e);
  }
  const categoryPaths = categoriesSlugs.map((slug) => ({
    url: `${baseUrl}/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Fetch dynamic products
  let productsSlugs = MOCK_PRODUCTS.map((p) => p.slug);
  try {
    const dbProds = await prisma.product.findMany({ select: { slug: true, updatedAt: true } });
    if (dbProds.length > 0) {
      productsSlugs = dbProds.map((p) => p.slug);
    }
  } catch (e) {
    console.warn("Could not query products for sitemap, using fallback static parameters:", e);
  }
  const productPaths = productsSlugs.map((slug) => ({
    url: `${baseUrl}/product/${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // Fetch dynamic blogs
  let blogsSlugs = MOCK_BLOGS.map((b) => b.slug);
  try {
    const dbBlogs = await prisma.blog.findMany({ select: { slug: true, updatedAt: true } });
    if (dbBlogs.length > 0) {
      blogsSlugs = dbBlogs.map((b) => b.slug);
    }
  } catch (e) {
    console.warn("Could not query blogs for sitemap, using fallback static parameters:", e);
  }
  const blogPaths = blogsSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPaths, ...categoryPaths, ...productPaths, ...blogPaths];
}
