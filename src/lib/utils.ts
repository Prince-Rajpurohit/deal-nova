import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function logAffiliateClick(
  targetType: "PRODUCT" | "DEAL" | "BLOG",
  targetId: string,
  storeName?: string
) {
  try {
    await fetch("/api/clicks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ targetType, targetId, storeName }),
    });
  } catch (error) {
    console.error("Failed to log click:", error);
  }
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}
