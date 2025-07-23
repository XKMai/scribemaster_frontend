import { create } from "zustand";
import type { EntitySummary } from "@/types/characterSchema";

type CombatState = {
  entities: EntitySummary[];
  setEntities: (entities: EntitySummary[]) => void;
  updateEntity: (updated: EntitySummary) => void;
  getEntityById: (id: number) => EntitySummary | undefined;

  logs: string[];                     
  addLog: (entry: string) => void;
};

export const useCombatStore = create<CombatState>((set, get) => ({
  entities: [],
  setEntities: (entities) => set({ entities }),

  updateEntity: (updated) =>
    set((state) => {
      const prev = state.entities.find((e) => e.id === updated.id);
      const logEntries: string[] = [];

      if (prev) {
        if (updated.hp !== prev.hp) {
          const diff = updated.hp - prev.hp;
          const change = diff > 0 ? `gained ${diff}` : `lost ${Math.abs(diff)}`;
          logEntries.push(`${updated.name} ${change} HP.`);
        }
        
      }

      // Append log entries
      if (logEntries.length > 0) {
        set((s) => ({ logs: [...s.logs, ...logEntries] }));
      }

      return {
        entities: state.entities.map((e) =>
          e.id === updated.id ? updated : e
        ),
      };
    }),

  getEntityById: (id) => {
    return get().entities.find((e) => e.id === id);
  },

  logs: [],
  addLog: (entry) =>
    set((state) => ({
      logs: [...state.logs, entry],
    })),
}));
