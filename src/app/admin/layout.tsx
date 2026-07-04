"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, ShoppingBag, FolderOpen, Tag, BookOpen, Mail, 
  ArrowLeft, LogOut, Loader2, Sparkles, Menu, X 
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      // Direct unauthorized users back home
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFBF7] dark:bg-[#111111]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-[#8B5A2B] dark:text-[#C2B280]" />
          <p className="font-serif text-sm text-[#706E6B] dark:text-[#A09D9A]">Verifying Admin Credentials...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user?.role !== "ADMIN") {
    return null;
  }

  const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: ShoppingBag },
    { name: "Categories", href: "/admin/categories", icon: FolderOpen },
    { name: "Deals Tracker", href: "/admin/deals", icon: Tag },
    { name: "Blogs CMS", href: "/admin/blogs", icon: BookOpen },
    { name: "Newsletter", href: "/admin/newsletters", icon: Mail },
  ];

  return (
    <div className="flex min-h-screen bg-[#FDFBF7] dark:bg-[#111111] transition-colors duration-300">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-[#EAE5D9] bg-[#F5F2EB] dark:border-[#2D2B2A] dark:bg-[#1A1A1A] p-6 justify-between transition-colors duration-300">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8B5A2B] text-white dark:bg-[#C2B280] dark:text-[#111111]">
              <Sparkles size={16} />
            </span>
            <span className="font-serif text-lg font-bold tracking-widest text-[#111111] dark:text-[#FDFBF7]">
              DEAL <span className="text-[#8B5A2B] dark:text-[#C2B280]">NOVA</span>
            </span>
          </div>

          <div className="text-[10px] font-bold uppercase tracking-widest text-[#8B5A2B] dark:text-[#C2B280]">
            Admin Control Center
          </div>

          {/* Nav list */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold tracking-wide transition-all ${
                    isActive
                      ? "bg-[#3E2723] text-white dark:bg-[#C2B280] dark:text-[#111111]"
                      : "text-[#706E6B] hover:bg-[#EAE5D9] hover:text-[#111111] dark:text-[#A09D9A] dark:hover:bg-[#2D2B2A] dark:hover:text-[#FDFBF7]"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-4 pt-6 border-t border-[#EAE5D9] dark:border-[#2D2B2A]">
          <Link
            href="/"
            className="flex items-center gap-3 text-sm font-semibold text-[#706E6B] hover:text-[#111111] dark:text-[#A09D9A] dark:hover:text-[#FDFBF7] transition-all"
          >
            <ArrowLeft size={18} />
            <span>Back to Storefront</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Header / Sidebar Drawer */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 border-b border-[#EAE5D9] bg-[#F5F2EB]/95 dark:border-[#2D2B2A] dark:bg-[#1A1A1A]/95 backdrop-blur-md flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8B5A2B] text-white dark:bg-[#C2B280] dark:text-[#111111]">
            <Sparkles size={12} />
          </span>
          <span className="font-serif text-base font-bold tracking-widest text-[#111111] dark:text-[#FDFBF7]">
            DEAL <span className="text-[#8B5A2B] dark:text-[#C2B280]">NOVA</span>
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-[#706E6B] hover:text-[#111111] dark:text-[#A09D9A] dark:hover:text-[#FDFBF7]"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Drawer Container */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
          <aside 
            className="absolute top-16 left-0 bottom-0 w-64 bg-[#F5F2EB] dark:bg-[#1A1A1A] p-6 flex flex-col justify-between border-r border-[#EAE5D9] dark:border-[#2D2B2A]"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold tracking-wide transition-all ${
                      isActive
                        ? "bg-[#3E2723] text-white dark:bg-[#C2B280] dark:text-[#111111]"
                        : "text-[#706E6B] hover:bg-[#EAE5D9] hover:text-[#111111] dark:text-[#A09D9A] dark:hover:bg-[#2D2B2A] dark:hover:text-[#FDFBF7]"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="pt-6 border-t border-[#EAE5D9] dark:border-[#2D2B2A]">
              <Link
                href="/"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 text-sm font-semibold text-[#706E6B] hover:text-[#111111] dark:text-[#A09D9A] dark:hover:text-[#FDFBF7]"
              >
                <ArrowLeft size={18} />
                <span>Storefront</span>
              </Link>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pt-16 lg:pt-0 overflow-y-auto">
        <header className="hidden lg:flex h-16 border-b border-[#EAE5D9] px-8 items-center justify-between dark:border-[#2D2B2A] bg-[#FDFBF7] dark:bg-[#111111] transition-colors duration-300">
          <h2 className="font-serif text-lg font-bold text-[#111111] dark:text-[#FDFBF7]">
            Portal Control Room
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#706E6B] dark:text-[#A09D9A]">
              Administrator: <strong className="text-[#111111] dark:text-[#FDFBF7]">{session.user?.name || "Admin"}</strong>
            </span>
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-8">
          {children}
        </main>
      </div>

    </div>
  );
}
