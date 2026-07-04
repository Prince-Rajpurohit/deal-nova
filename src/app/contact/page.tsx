"use client";

import React, { useState } from "react";
import { Mail, MessageSquare, Send, CheckCircle, Info } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (res.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <>
      <Navbar />

      <main className="flex-grow bg-[#FDFBF7] py-16 dark:bg-[#111111] transition-colors duration-300">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8B5A2B] dark:text-[#C2B280]">
              Get In Touch
            </span>
            <h1 className="mt-3 font-serif text-4xl font-bold text-[#111111] dark:text-[#FDFBF7]">
              Contact Deal Nova
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#706E6B] dark:text-[#A09D9A]">
              Have questions regarding our product comparisons, partner requests, or newsletter subscriptions? Write us below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            
            {/* Info Cards (1 col) */}
            <div className="space-y-4 md:col-span-1">
              <div className="rounded-xl border border-[#EAE5D9] bg-[#F5F2EB] p-5 dark:border-[#2D2B2A] dark:bg-[#1A1A1A]">
                <h4 className="font-serif text-sm font-bold text-[#111111] dark:text-[#FDFBF7] flex items-center gap-2 mb-2">
                  <Mail size={16} />
                  <span>Email Support</span>
                </h4>
                <p className="text-xs text-[#706E6B] dark:text-[#A09D9A]">
                  For corporate partnerships and support:
                </p>
                <p className="text-xs font-bold text-[#8B5A2B] dark:text-[#C2B280] mt-1.5">
                  hello@dealnova.com
                </p>
              </div>

              <div className="rounded-xl border border-[#EAE5D9] bg-[#F5F2EB] p-5 dark:border-[#2D2B2A] dark:bg-[#1A1A1A]">
                <h4 className="font-serif text-sm font-bold text-[#111111] dark:text-[#FDFBF7] flex items-center gap-2 mb-2">
                  <Info size={16} />
                  <span>Affiliate Queries</span>
                </h4>
                <p className="text-xs text-[#706E6B] dark:text-[#A09D9A] leading-relaxed">
                  We verify pricing links daily. To report a broken link or outdated offer price, please specify the product URL.
                </p>
              </div>
            </div>

            {/* Form Card (2 cols) */}
            <div className="md:col-span-2 rounded-2xl border border-[#EAE5D9] bg-white p-6 sm:p-8 dark:border-[#2D2B2A] dark:bg-[#1A1A1A]">
              {status === "success" ? (
                <div className="text-center py-8">
                  <CheckCircle size={48} className="mx-auto text-green-500 mb-4 animate-bounce" />
                  <h3 className="font-serif text-lg font-bold text-[#111111] dark:text-[#FDFBF7]">
                    Message Sent Successfully
                  </h3>
                  <p className="text-xs text-[#706E6B] dark:text-[#A09D9A] mt-2 max-w-sm mx-auto">
                    Thank you for reaching out. A curation support editor will respond to your query within 24 business hours.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-6 rounded-lg bg-[#3E2723] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#8B5A2B] dark:bg-[#C2B280] dark:text-[#111111] dark:hover:bg-[#FDFBF7]"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {status === "error" && (
                    <div className="rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-600 dark:bg-red-950/20 dark:text-red-400">
                      Could not deliver message. Please check connection and try again.
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full mt-1.5 rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-3 px-4 text-xs text-[#111111] placeholder-[#706E6B] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full mt-1.5 rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-3 px-4 text-xs text-[#111111] placeholder-[#706E6B] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Pricing discrepancy, broken link, partnership..."
                      className="w-full mt-1.5 rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-3 px-4 text-xs text-[#111111] placeholder-[#706E6B] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
                      Detailed Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your support ticket details here..."
                      className="w-full mt-1.5 rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-3 px-4 text-xs text-[#111111] placeholder-[#706E6B] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#3E2723] py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#8B5A2B] dark:bg-[#C2B280] dark:text-[#111111] dark:hover:bg-[#FDFBF7] disabled:opacity-60 transition-all mt-4"
                  >
                    {status === "loading" ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <span>Submit Ticket</span>
                        <Send size={12} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
