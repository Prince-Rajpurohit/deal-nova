"use client";

import React, { useState } from "react";
import { Mail, Send, Check } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="mx-auto max-w-4xl rounded-2xl border border-[#EAE5D9] bg-[#F5F2EB] p-8 text-center dark:border-[#2D2B2A] dark:bg-[#1A1A1A] transition-all duration-300">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#8B5A2B] text-white dark:bg-[#C2B280] dark:text-[#111111] mb-4">
        <Mail size={22} />
      </div>
      
      <h3 className="font-serif text-2xl font-bold tracking-wide text-[#111111] dark:text-[#FDFBF7]">
        Unlock The Nova Club
      </h3>
      
      <p className="mx-auto mt-2 max-w-lg text-sm text-[#706E6B] dark:text-[#A09D9A] leading-relaxed">
        Receive weekly handpicked luxury edits, limited flash coupon codes, and private deals straight to your inbox. No spam, unsubscribe anytime.
      </p>

      <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-md items-center gap-2">
        <input
          type="email"
          required
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading" || status === "success"}
          className="w-full rounded-lg border border-[#EAE5D9] bg-[#FDFBF7] px-4 py-3 text-sm text-[#111111] placeholder-[#706E6B] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white dark:focus:border-[#C2B280] disabled:opacity-60 transition-all"
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="flex h-full items-center justify-center rounded-lg bg-[#3E2723] px-6 py-3 text-sm font-bold text-white hover:bg-[#8B5A2B] dark:bg-[#C2B280] dark:text-[#111111] dark:hover:bg-[#FDFBF7] disabled:opacity-60 transition-all shrink-0"
        >
          {status === "loading" ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : status === "success" ? (
            <Check size={16} />
          ) : (
            <span className="flex items-center gap-1.5">
              <span>Subscribe</span>
              <Send size={14} />
            </span>
          )}
        </button>
      </form>

      {status === "success" && (
        <p className="mt-3 text-xs font-semibold text-green-600 dark:text-green-400">
          Welcome to the club! Check your email for your exclusive welcome gift.
        </p>
      )}
      
      {status === "error" && (
        <p className="mt-3 text-xs font-semibold text-red-600 dark:text-red-400">
          Something went wrong. Please check your spelling or try again later.
        </p>
      )}
    </div>
  );
}
