"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, X, Heart, Sun, Moon, User, LogOut, ChevronDown, Sparkles
} from "lucide-react";
import { useTheme } from "@/components/provider-wrapper";
import { useStore } from "@/store/useStore";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Fashion", href: "/category/fashion" },
  { name: "Sneakers", href: "/category/sneakers" },
  { name: "Watches", href: "/category/watches" },
  { name: "Gadgets", href: "/category/gadgets" },
  { name: "Deals", href: "/deals" },
  { name: "Blog", href: "/blog" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const wishlistCount = useStore((state) => state.wishlist.length);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#EAE5D9] bg-[#FDFBF7]/90 backdrop-blur-md dark:border-[#2D2B2A] dark:bg-[#111111]/90 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#8B5A2B] text-white dark:bg-[#C2B280] dark:text-[#111111]">
              <Sparkles size={16} className="group-hover:rotate-12 transition-transform duration-300" />
            </span>
            <span className="font-serif text-2xl font-bold tracking-widest text-[#111111] dark:text-[#FDFBF7]">
              DEAL <span className="text-[#8B5A2B] dark:text-[#C2B280]">NOVA</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative text-sm font-medium tracking-wide transition-colors duration-300 py-2 hover:text-[#8B5A2B] dark:hover:text-[#C2B280] ${
                    isActive 
                      ? "text-[#8B5A2B] dark:text-[#C2B280]" 
                      : "text-[#706E6B] dark:text-[#A09D9A]"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 h-0.5 w-full bg-[#8B5A2B] dark:bg-[#C2B280]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 text-[#706E6B] hover:bg-[#F5F2EB] hover:text-[#111111] dark:text-[#A09D9A] dark:hover:bg-[#1A1A1A] dark:hover:text-[#FDFBF7] transition-all duration-300"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Wishlist Link */}
            <Link
              href="/profile?tab=wishlist"
              className="relative rounded-full p-2 text-[#706E6B] hover:bg-[#F5F2EB] hover:text-[#111111] dark:text-[#A09D9A] dark:hover:bg-[#1A1A1A] dark:hover:text-[#FDFBF7] transition-all duration-300"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#8B5A2B] text-[10px] font-bold text-[#FDFBF7] dark:bg-[#C2B280] dark:text-[#111111] animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User Dropdown / Auth Link */}
            <div className="relative">
              {session ? (
                <>
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center space-x-2 rounded-full p-1 border border-[#EAE5D9] hover:bg-[#F5F2EB] dark:border-[#2D2B2A] dark:hover:bg-[#1A1A1A] transition-all duration-300"
                  >
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8B5A2B] text-white text-sm font-semibold">
                        {session.user?.name?.[0] || "U"}
                      </span>
                    )}
                    <ChevronDown size={14} className="text-[#706E6B] dark:text-[#A09D9A]" />
                  </button>

                  <AnimatePresence>
                    {isUserDropdownOpen && (
                      <>
                        {/* Overlay backdrop to close */}
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setIsUserDropdownOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-[#EAE5D9] bg-[#FDFBF7] p-2 shadow-lg dark:border-[#2D2B2A] dark:bg-[#1A1A1A]"
                        >
                          <div className="px-3 py-2 border-b border-[#EAE5D9] dark:border-[#2D2B2A] text-xs font-semibold text-[#706E6B] dark:text-[#A09D9A] truncate">
                            Hi, {session.user?.name || "Member"}
                          </div>
                          
                          {session.user?.role === "ADMIN" && (
                            <Link
                              href="/admin"
                              onClick={() => setIsUserDropdownOpen(false)}
                              className="flex w-full items-center px-3 py-2 text-sm text-[#8B5A2B] dark:text-[#C2B280] font-semibold hover:bg-[#F5F2EB] dark:hover:bg-[#2D2B2A] rounded-md transition-all duration-300"
                            >
                              Admin Dashboard
                            </Link>
                          )}
                          
                          <Link
                            href="/profile"
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="flex w-full items-center px-3 py-2 text-sm text-[#111111] dark:text-[#FDFBF7] hover:bg-[#F5F2EB] dark:hover:bg-[#2D2B2A] rounded-md transition-all duration-300"
                          >
                            My Profile
                          </Link>
                          <button
                            onClick={() => {
                              setIsUserDropdownOpen(false);
                              signOut({ callbackUrl: "/" });
                            }}
                            className="flex w-full items-center px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-[#F5F2EB] dark:hover:bg-[#2D2B2A] rounded-md transition-all duration-300 text-left"
                          >
                            <LogOut size={16} className="mr-2" />
                            Log Out
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center space-x-1.5 rounded-full bg-[#3E2723] px-5 py-2 text-xs font-semibold tracking-wider uppercase text-white hover:bg-[#8B5A2B] dark:bg-[#FDFBF7] dark:text-[#111111] dark:hover:bg-[#C2B280] transition-all duration-300"
                >
                  <User size={14} />
                  <span>Login</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex md:hidden rounded-full p-2 text-[#706E6B] hover:bg-[#F5F2EB] dark:text-[#A09D9A] dark:hover:bg-[#1A1A1A] transition-all duration-300"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-[#EAE5D9] bg-[#FDFBF7] dark:border-[#2D2B2A] dark:bg-[#111111] overflow-hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-base font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-[#F5F2EB] text-[#8B5A2B] dark:bg-[#1A1A1A] dark:text-[#C2B280]"
                      : "text-[#706E6B] hover:bg-[#F5F2EB] dark:text-[#A09D9A] dark:hover:bg-[#1A1A1A]"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {!session && (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center space-x-2 mt-4 rounded-lg bg-[#3E2723] py-3 text-sm font-semibold text-white dark:bg-[#FDFBF7] dark:text-[#111111]"
                >
                  <User size={16} />
                  <span>Login / Register</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
