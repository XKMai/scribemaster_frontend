import { create } from "zustand";
import type { EntitySummary } from "@/types/characterSchema";
import type { useSocket } from "../sockets/useSocket";

type LogEntry = {
  sender: string;
  message: string;
  timestamp: number;
};

type CombatState = {
  entities: EntitySummary[];
  setEntities: (entities: EntitySummary[]) => void;
  updateEntity: (updated: EntitySummary) => void;
  getEntityById: (id: number) => EntitySummary | undefined;

  logs: LogEntry[];                     
  addLog: (entry: LogEntry, emitToRoom?: boolean) => void;

  socket: ReturnType<typeof useSocket>["socket"] | null;
  roomId: string | null;
  setSocket: (socket: CombatState["socket"]) => void;
  setRoomId: (roomId: string | null) => void;
};

export const useCombatStore = create<CombatState>((set, get) => ({
  entities: [],
  setEntities: (entities) => set({ entities }),

  updateEntity: (updated) => {
    set((state) => ({
      entities: state.entities.map((e) =>
        e.id === updated.id ? updated : e
      ),
  }));

  },

  getEntityById: (id) => {
    return get().entities.find((e) => e.id === id);
  },

  logs: [],
  addLog: (entry, emitToRoom = false) => {
    set((state) => ({
      logs: [...state.logs, entry],
    }));

    const socket = get().socket;
    const roomId = get().roomId;

    if (emitToRoom && socket && roomId) {
      socket.emit("chatMessage", {
        roomName: roomId,
        sender: entry.sender,
        message: entry.message,
      });
    }
  },


  socket: null,
  roomId: null,
  setSocket: (socket) => set({ socket }),
  setRoomId: (roomId) => set({ roomId }),
}));
