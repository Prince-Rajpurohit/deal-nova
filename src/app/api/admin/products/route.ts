import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// List products
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      include: {
        category: { select: { name: true } },
        affiliateLinks: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Admin products list error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Add a new product
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      slug,
      description,
      images,
      priceOriginal,
      priceDiscounted,
      rating,
      features,
      specs,
      pros,
      cons,
      isTopPick,
      isBestSeller,
      isFeatured,
      categoryId,
      affiliateLinks, // Expecting Array<{ storeName: string, url: string, price: number, isPrimary: boolean }>
    } = body;

    if (!title || !slug || !description || !categoryId) {
      return NextResponse.json({ error: "Missing required product fields" }, { status: 400 });
    }

    const cleanSlug = slug.trim().toLowerCase().replace(/\s+/g, "-");

    // Check collision
    const existing = await prisma.product.findFirst({
      where: { slug: cleanSlug },
    });

    if (existing) {
      return NextResponse.json({ error: "Product slug already exists" }, { status: 400 });
    }

    // Insert product
    const product = await prisma.product.create({
      data: {
        title,
        slug: cleanSlug,
        description,
        images: images || ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"],
        priceOriginal: Number(priceOriginal) || 0,
        priceDiscounted: Number(priceDiscounted) || 0,
        rating: Number(rating) || 4.5,
        features: features || [],
        specs: specs || {},
        pros: pros || [],
        cons: cons || [],
        isTopPick: Boolean(isTopPick),
        isBestSeller: Boolean(isBestSeller),
        isFeatured: Boolean(isFeatured),
        categoryId,
      },
    });

    // Insert affiliate links if provided
    if (affiliateLinks && Array.isArray(affiliateLinks) && affiliateLinks.length > 0) {
      await prisma.affiliateLink.createMany({
        data: affiliateLinks.map((link: any) => ({
          productId: product.id,
          storeName: link.storeName,
          url: link.url,
          price: Number(link.price) || Number(priceDiscounted) || 0,
          isPrimary: Boolean(link.isPrimary),
        })),
      });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Admin product create error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Delete product
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin product delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
