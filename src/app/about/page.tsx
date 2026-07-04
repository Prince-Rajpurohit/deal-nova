import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Heart } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata = {
  title: "Our Story | Deal Nova",
  description: "Learn more about the team behind Deal Nova and our mission to curate premium style products on a budget.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="flex-grow bg-[#FDFBF7] py-16 dark:bg-[#111111] transition-colors duration-300">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8B5A2B] dark:text-[#C2B280]">
              The Curation Philosophy
            </span>
            <h1 className="mt-3 font-serif text-4xl font-bold text-[#111111] dark:text-[#FDFBF7] sm:text-5xl">
              About Deal Nova
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#706E6B] dark:text-[#A09D9A]">
              We believe premium style, reliable chronographs, and cutting-edge tech shouldn't require a designer inheritance.
            </p>
          </div>

          {/* Story Content */}
          <div className="prose max-w-none text-[#706E6B] dark:text-[#A09D9A] text-sm leading-relaxed space-y-6">
            <p>
              Founded in 2026, **Deal Nova** was born out of a simple frustration: the digital marketplace is saturated with noise. Millions of products, fluctuating pricing, fake discounts, and low-quality knockoffs make discovering genuinely great products a chore.
            </p>
            <p>
              Our small team of curation editors set out to construct a different kind of platform. Rather than listing hundreds of thousands of random items, we select a handful of products that represent the peak of **aesthetics, performance, and budget value**.
            </p>
            
            <h3 className="font-serif text-2xl font-bold text-[#111111] dark:text-[#FDFBF7] pt-4">
              Our Core Principles
            </h3>
            <p>
              Every watch, pair of sneakers, or smart speaker featured on Deal Nova undergoes a rigorous evaluation based on three simple pillars:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="rounded-xl border border-[#EAE5D9] bg-[#F5F2EB] p-5 dark:border-[#2D2B2A] dark:bg-[#1A1A1A]">
                <div className="h-8 w-8 rounded-full bg-[#8B5A2B] text-white dark:bg-[#C2B280] dark:text-[#111111] flex items-center justify-center mb-3">
                  <Sparkles size={16} />
                </div>
                <h4 className="font-serif text-base font-bold text-[#111111] dark:text-[#FDFBF7]">Premium Design</h4>
                <p className="text-xs text-gray-500 mt-1">We highlight products that invoke the "quiet luxury" style—minimalist beige, cream, sand tones, and clean materials.</p>
              </div>

              <div className="rounded-xl border border-[#EAE5D9] bg-[#F5F2EB] p-5 dark:border-[#2D2B2A] dark:bg-[#1A1A1A]">
                <div className="h-8 w-8 rounded-full bg-[#8B5A2B] text-white dark:bg-[#C2B280] dark:text-[#111111] flex items-center justify-center mb-3">
                  <ShieldCheck size={16} />
                </div>
                <h4 className="font-serif text-base font-bold text-[#111111] dark:text-[#FDFBF7]">Verified Value</h4>
                <p className="text-xs text-gray-500 mt-1">We track pricing histories on Amazon, Myntra, and Flipkart to ensure discounts are genuine bargains, not markup tricks.</p>
              </div>

              <div className="rounded-xl border border-[#EAE5D9] bg-[#F5F2EB] p-5 dark:border-[#2D2B2A] dark:bg-[#1A1A1A]">
                <div className="h-8 w-8 rounded-full bg-[#8B5A2B] text-white dark:bg-[#C2B280] dark:text-[#111111] flex items-center justify-center mb-3">
                  <Heart size={16} />
                </div>
                <h4 className="font-serif text-base font-bold text-[#111111] dark:text-[#FDFBF7]">Honest Appraisals</h4>
                <p className="text-xs text-gray-500 mt-1">Our pros and cons details are written by human reviewers, pointing out real flaws and limitations before you click buy.</p>
              </div>
            </div>

            <p className="pt-6">
              To support our curation efforts, Deal Nova participates in various affiliate marketing networks. When you click on one of our recommended store comparison links and buy, we receive a minor commission from the retailer at zero additional expense to you. This enables us to maintain an ad-free, high-quality, clean discovery interface.
            </p>
          </div>

          {/* CTA */}
          <div className="text-center pt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-[#3E2723] px-6 py-3 text-sm font-bold text-white hover:bg-[#8B5A2B] dark:bg-[#C2B280] dark:text-[#111111] dark:hover:bg-[#FDFBF7] transition-all"
            >
              <span>Explore Our Curated Picks</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
