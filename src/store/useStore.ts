import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StoreState {
  wishlist: string[];
  recentlyViewed: string[];
  addToWishlist: (id: string) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  addToRecentlyViewed: (id: string) => void;
  clearWishlist: () => void;
  clearRecentlyViewed: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      wishlist: [],
      recentlyViewed: [],

      addToWishlist: (id: string) => {
        const { wishlist } = get();
        if (!wishlist.includes(id)) {
          set({ wishlist: [...wishlist, id] });
        }
      },

      removeFromWishlist: (id: string) => {
        const { wishlist } = get();
        set({ wishlist: wishlist.filter((item) => item !== id) });
      },

      isInWishlist: (id: string) => {
        return get().wishlist.includes(id);
      },

      addToRecentlyViewed: (id: string) => {
        const { recentlyViewed } = get();
        // Remove duplicate and append to front
        const filtered = recentlyViewed.filter((item) => item !== id);
        // Keep at most 8 items
        const updated = [id, ...filtered].slice(0, 8);
        set({ recentlyViewed: updated });
      },

      clearWishlist: () => set({ wishlist: [] }),
      clearRecentlyViewed: () => set({ recentlyViewed: [] }),
    }),
    {
      name: "deal-nova-storage", // name of the item in localStorage
    }
  )
);
