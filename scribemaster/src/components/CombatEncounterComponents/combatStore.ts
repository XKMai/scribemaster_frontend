import { create } from "zustand";
import type { EntitySummary } from "@/types/characterSchema";

type CombatState = {
  entities: EntitySummary[];
  setEntities: (entities: EntitySummary[]) => void;
  updateEntity: (updated: EntitySummary) => void;
  getEntityById: (id: number) => EntitySummary | undefined;
};

export const useCombatStore = create<CombatState>((set, get) => ({
  entities: [],
  setEntities: (entities) => set({ entities }),

  updateEntity: (updated) =>
    set((state) => ({
      entities: state.entities.map((e) =>
        e.id === updated.id ? updated : e
      ),
    })),

  getEntityById: (id) => {
    return get().entities.find((e) => e.id === id);
  },
}));
