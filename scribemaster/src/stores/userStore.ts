import { apiService } from "@/services/apiservice";
import { create } from "zustand"

type User = {
    id: number,
    name: string,
}

type UserStore = {
    user: User | null,
    isLoading: boolean,
    initialiseUser: () => Promise<void>,
    setUser: (user: User | null) => void,
}

export const userStore = create<UserStore>((set) => ({
  user: null,
  isLoading: false,

  initialiseUser: async () => {
    set({ isLoading: true });
    try {
      const res = await apiService.getCookie();
      if (!res.ok) throw new Error("Failed to fetch user");
      const userData = await res.user();
      set({ user: userData });
    } catch (err) {
      console.error("User init error:", err);
      set({ user: null });
    } finally {
      set({ isLoading: false });
    }
  },

  setUser: (user) => set({ user }),
}));