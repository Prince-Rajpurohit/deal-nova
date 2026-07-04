import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idsString = searchParams.get("ids");

    if (!idsString) {
      return NextResponse.json([]);
    }

    const ids = idsString.split(",").filter((id) => id.trim() !== "");

    if (ids.length === 0) {
      return NextResponse.json([]);
    }

    const products = await prisma.product.findMany({
      where: {
        id: { in: ids },
      },
      include: {
        category: { select: { name: true } },
        affiliateLinks: true,
      },
    });

    // Maintain search order
    const orderedProducts = ids
      .map((id) => products.find((p) => p.id === id))
      .filter((p) => p !== undefined);

    return NextResponse.json(orderedProducts);
  } catch (error) {
    console.error("Bulk products fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
