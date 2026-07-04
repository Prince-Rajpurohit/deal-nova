"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Mail, Send, Check } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setIsSubmitted(true);
        setEmail("");
        setTimeout(() => setIsSubmitted(false), 5000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <footer className="w-full bg-[#1A1A1A] text-[#FDFBF7] dark:bg-[#0A0A0A] border-t border-[#2D2B2A] transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:gap-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C2B280] text-[#111111]">
                <Sparkles size={16} />
              </span>
              <span className="font-serif text-xl font-bold tracking-widest text-[#FDFBF7]">
                DEAL <span className="text-[#C2B280]">NOVA</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-[#A09D9A]">
              Curating the world's finest fashion, tech accessories, and luxury items at exceptional values. We track prices across leading platforms so you don't have to.
            </p>
          </div>

          {/* Quick Categories */}
          <div>
            <h3 className="font-serif text-base font-semibold uppercase tracking-wider text-[#C2B280] mb-6">Shop Categories</h3>
            <ul className="space-y-3 text-sm text-[#A09D9A]">
              <li><Link href="/category/fashion" className="hover:text-[#FDFBF7] transition">Fashion Picks</Link></li>
              <li><Link href="/category/sneakers" className="hover:text-[#FDFBF7] transition">Premium Sneakers</Link></li>
              <li><Link href="/category/watches" className="hover:text-[#FDFBF7] transition">Elite Watches</Link></li>
              <li><Link href="/category/gadgets" className="hover:text-[#FDFBF7] transition">Smart Gadgets</Link></li>
              <li><Link href="/category/home-essentials" className="hover:text-[#FDFBF7] transition">Home Upgrades</Link></li>
            </ul>
          </div>

          {/* Company & Legals */}
          <div>
            <h3 className="font-serif text-base font-semibold uppercase tracking-wider text-[#C2B280] mb-6">Information</h3>
            <ul className="space-y-3 text-sm text-[#A09D9A]">
              <li><Link href="/about" className="hover:text-[#FDFBF7] transition">Our Story</Link></li>
              <li><Link href="/contact" className="hover:text-[#FDFBF7] transition">Contact Support</Link></li>
              <li><Link href="/blog" className="hover:text-[#FDFBF7] transition">Expert Blog</Link></li>
              <li><Link href="/privacy" className="hover:text-[#FDFBF7] transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#FDFBF7] transition">Terms of Service</Link></li>
              <li><Link href="/disclosure" className="hover:text-[#FDFBF7] transition">Affiliate Disclosure</Link></li>
            </ul>
          </div>

          {/* Newsletter Panel */}
          <div>
            <h3 className="font-serif text-base font-semibold uppercase tracking-wider text-[#C2B280] mb-6">Newsletter</h3>
            <p className="text-sm text-[#A09D9A] mb-4">
              Subscribe to unlock early access to luxury deals, exclusive coupons, and curated styling guides.
            </p>
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-[#2D2B2A] bg-[#111111] py-3 pl-4 pr-12 text-sm text-white placeholder-[#706E6B] focus:border-[#C2B280] focus:ring-1 focus:ring-[#C2B280] focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 rounded-md bg-[#C2B280] p-2 text-[#111111] hover:bg-[#FDFBF7] transition-all"
                aria-label="Submit Email"
              >
                {isSubmitted ? <Check size={16} className="text-green-800" /> : <Send size={16} />}
              </button>
            </form>
            {isSubmitted && (
              <p className="mt-2 text-xs text-green-400">Successfully subscribed to Deal Nova newsletters!</p>
            )}
          </div>
        </div>

        {/* Footer bottom */}
        <div className="mt-16 border-t border-[#2D2B2A] pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#706E6B]">
          <p>© {new Date().getFullYear()} Deal Nova. All rights reserved.</p>
          <p className="mt-4 sm:mt-0 text-center sm:text-right">
            Disclaimer: Deal Nova is a participant in affiliate advertising programs designed to provide a means for sites to earn commissions.
          </p>
        </div>
      </div>
    </footer>
  );
}
