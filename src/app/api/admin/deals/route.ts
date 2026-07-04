import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// List all deals
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const deals = await prisma.deal.findMany({
      include: {
        category: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(deals);
  } catch (error) {
    console.error("Admin deals list error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Add a new deal
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
      image,
      discountPercentage,
      originalPrice,
      dealPrice,
      storeName,
      affiliateUrl,
      endsAt,
      isFeatured,
      categoryId,
    } = body;

    if (!title || !slug || !dealPrice || !storeName || !affiliateUrl || !categoryId) {
      return NextResponse.json({ error: "Missing required deal fields" }, { status: 400 });
    }

    const cleanSlug = slug.trim().toLowerCase().replace(/\s+/g, "-");

    // Check collision
    const existing = await prisma.deal.findFirst({
      where: { slug: cleanSlug },
    });

    if (existing) {
      return NextResponse.json({ error: "Deal slug already exists" }, { status: 400 });
    }

    const deal = await prisma.deal.create({
      data: {
        title,
        slug: cleanSlug,
        description,
        image: image || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&auto=format&fit=crop&q=80",
        discountPercentage: Number(discountPercentage) || 0,
        originalPrice: Number(originalPrice) || 0,
        dealPrice: Number(dealPrice),
        storeName,
        affiliateUrl,
        endsAt: endsAt ? new Date(endsAt) : null,
        isFeatured: Boolean(isFeatured),
        categoryId,
      },
    });

    return NextResponse.json(deal);
  } catch (error) {
    console.error("Admin deal create error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Delete deal
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Deal ID is required" }, { status: 400 });
    }

    await prisma.deal.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin deal delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
