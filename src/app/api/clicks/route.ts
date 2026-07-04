import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { targetType, targetId, storeName } = body;

    if (!targetType || !targetId) {
      return NextResponse.json(
        { error: "Missing targetType or targetId" },
        { status: 400 }
      );
    }

    // Log the click in the database
    const click = await prisma.clickLog.create({
      data: {
        targetType,
        targetId,
        storeName: storeName || null,
      },
    });

    return NextResponse.json({ success: true, id: click.id });
  } catch (error) {
    console.error("Error logging click:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
