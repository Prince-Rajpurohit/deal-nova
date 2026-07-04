"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, Sparkles, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) return;

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Registration failed");
        setLoading(false);
      } else {
        setSuccess(true);
        setLoading(false);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FDFBF7] px-4 py-12 dark:bg-[#111111] transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8 rounded-2xl border border-[#EAE5D9] bg-[#FDFBF7] p-8 shadow-md dark:border-[#2D2B2A] dark:bg-[#1A1A1A]"
      >
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8B5A2B] text-white dark:bg-[#C2B280] dark:text-[#111111]">
              <Sparkles size={14} />
            </span>
            <span className="font-serif text-lg font-bold tracking-widest text-[#111111] dark:text-[#FDFBF7]">
              DEAL <span className="text-[#8B5A2B] dark:text-[#C2B280]">NOVA</span>
            </span>
          </Link>
          <h2 className="mt-6 font-serif text-2xl font-bold text-[#111111] dark:text-[#FDFBF7]">
            Create Account
          </h2>
          <p className="mt-2 text-xs text-[#706E6B] dark:text-[#A09D9A]">
            Join Deal Nova today and track the best premium discounts.
          </p>
        </div>

        {success ? (
          <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-950/20">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 mb-2">
              <CheckCircle size={20} />
            </div>
            <h4 className="text-sm font-bold text-green-800 dark:text-green-400">Account Created!</h4>
            <p className="text-xs text-green-700 dark:text-green-300 mt-1">Redirecting you to the login page...</p>
          </div>
        ) : (
          <>
            {errorMsg && (
              <div className="rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-600 dark:bg-red-950/20 dark:text-red-400">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
                  Full Name
                </label>
                <div className="relative mt-1 flex items-center">
                  <User size={16} className="absolute left-3 text-[#706E6B] dark:text-[#A09D9A]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-3 pl-10 pr-4 text-sm text-[#111111] placeholder-[#706E6B] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white dark:focus:border-[#C2B280]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
                  Email Address
                </label>
                <div className="relative mt-1 flex items-center">
                  <Mail size={16} className="absolute left-3 text-[#706E6B] dark:text-[#A09D9A]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-3 pl-10 pr-4 text-sm text-[#111111] placeholder-[#706E6B] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white dark:focus:border-[#C2B280]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
                  Password
                </label>
                <div className="relative mt-1 flex items-center">
                  <Lock size={16} className="absolute left-3 text-[#706E6B] dark:text-[#A09D9A]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-3 pl-10 pr-12 text-sm text-[#111111] placeholder-[#706E6B] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white dark:focus:border-[#C2B280]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-[#706E6B] hover:text-[#111111] dark:text-[#A09D9A] dark:hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#706E6B] dark:text-[#A09D9A]">
                  Confirm Password
                </label>
                <div className="relative mt-1 flex items-center">
                  <Lock size={16} className="absolute left-3 text-[#706E6B] dark:text-[#A09D9A]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-[#EAE5D9] bg-[#F5F2EB] py-3 pl-10 pr-12 text-sm text-[#111111] placeholder-[#706E6B] focus:border-[#8B5A2B] focus:outline-none dark:border-[#2D2B2A] dark:bg-[#111111] dark:text-white dark:focus:border-[#C2B280]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-lg bg-[#3E2723] py-3 text-sm font-bold text-white hover:bg-[#8B5A2B] dark:bg-[#C2B280] dark:text-[#111111] dark:hover:bg-[#FDFBF7] disabled:opacity-60 transition-all mt-6"
              >
                {loading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <p className="text-center text-xs text-[#706E6B] dark:text-[#A09D9A] mt-6">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-[#8B5A2B] hover:underline dark:text-[#C2B280]">
                Sign In
              </Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
