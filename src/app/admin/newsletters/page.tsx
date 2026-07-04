"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail, Trash2, Loader2, Users } from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  subscribed: boolean;
  createdAt: string;
}

export default function AdminNewslettersPage() {
  const queryClient = useQueryClient();

  const { data: subscribers, isLoading, isError } = useQuery<Subscriber[]>({
    queryKey: ["admin-subscribers"],
    queryFn: async () => {
      const res = await fetch("/api/admin/newsletters");
      if (!res.ok) throw new Error("Failed to fetch subscribers");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/newsletters?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete subscriber");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-subscribers"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#8B5A2B] dark:text-[#C2B280]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#111111] dark:text-[#FDFBF7]">
          Newsletter Club Members
        </h1>
        <p className="text-xs text-[#706E6B] dark:text-[#A09D9A] mt-1">
          Review premium newsletter subscribers list.
        </p>
      </div>

      <div className="rounded-xl border border-[#EAE5D9] bg-white p-6 dark:border-[#2D2B2A] dark:bg-[#1A1A1A]">
        <div className="flex items-center gap-2 mb-6 border-b border-[#EAE5D9] pb-3 dark:border-[#2D2B2A]">
          <Users size={20} className="text-[#8B5A2B] dark:text-[#C2B280]" />
          <h3 className="font-serif text-lg font-bold text-[#111111] dark:text-[#FDFBF7]">
            Active Subscribers ({subscribers?.length || 0})
          </h3>
        </div>

        {subscribers?.length === 0 ? (
          <div className="text-center py-16">
            <Mail className="mx-auto text-gray-300 dark:text-gray-700 mb-4" size={48} />
            <p className="text-sm text-[#706E6B] dark:text-[#A09D9A]">No subscribers registered yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#EAE5D9] dark:border-[#2D2B2A] text-gray-400 uppercase tracking-widest font-bold">
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Subscribed Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE5D9] dark:divide-[#2D2B2A]">
                {subscribers?.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#F5F2EB]/30 dark:hover:bg-[#111111]/30 transition">
                    <td className="py-3.5 px-4 font-bold text-[#111111] dark:text-[#FDFBF7]">
                      {sub.email}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        sub.subscribed 
                          ? "bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {sub.subscribed ? "Active" : "Unsubscribed"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-400">
                      {new Date(sub.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Remove email "${sub.email}" from newsletter list?`)) {
                            deleteMutation.mutate(sub.id);
                          }
                        }}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                        aria-label="Delete Subscriber"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
