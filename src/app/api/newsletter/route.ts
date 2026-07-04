import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Save user to the newsletter database table
    const subscription = await prisma.newsletter.upsert({
      where: { email },
      update: { subscribed: true },
      create: { email, subscribed: true },
    });

    return NextResponse.json({ success: true, id: subscription.id });
  } catch (error) {
    console.error("Newsletter submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
