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
    clearUser: () => void,
    refreshKey: number,
    triggerRefresh: () => void,
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: false,

  initialiseUser: async () => {
    set({ isLoading: true });
    try {
      const userData = await apiService.getCookie();
      console.log("User data:", userData)
      set({ user: userData.user });
    } catch (err) {
      console.error("User init error:", err);
      set({ user: null });
    } finally {
      set({ isLoading: false });
    }
  },

  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),

  refreshKey: 0,
  triggerRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),
}));