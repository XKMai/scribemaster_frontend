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
      console.log("🔄 updateEntity called for:", updated.name, "ID:", updated.id);

  const prev = get().entities.find((e) => e.id === updated.id);
  const logEntries: string[] = [];

  if (prev) {
    if (updated.hp !== prev.hp) {

      console.log("📊 Comparing:", { 
        prevHP: prev.hp, 
        newHP: updated.hp,
        prevMaxHP: prev.maxhp,
        newMaxHP: updated.maxhp 
      });

      const diff = updated.hp - prev.hp;
      const change = diff > 0 ? `gained ${diff}` : `lost ${Math.abs(diff)}`;
      logEntries.push(`${updated.name} ${change} HP.`);
    }

    if (updated.maxhp !== prev.maxhp) {
      const diff = updated.maxhp - prev.maxhp;
      const change = diff > 0 ? `increased max HP by ${diff}` : `reduced max HP by ${Math.abs(diff)}`;
      logEntries.push(`${updated.name} ${change}.`);
    }

    // if (updated.temphp !== prev.temphp) {
    //   const diff = updated.temphp - prev.temphp;
    //   const change = diff > 0 ? `gained ${diff}` : `lost ${Math.abs(diff)}`;
    //   logEntries.push(`${updated.name} ${change} temporary HP.`);
    // }

    if (updated.speed !== prev.speed) {
      logEntries.push(`${updated.name} speed changed from ${prev.speed} to ${updated.speed}.`);
    }
  }

    console.log("📝 Generated log entries:", logEntries);


  // Emit logs if any
  const emit = get().socket;
  const roomId = get().roomId;

  if (emit && roomId && logEntries.length > 0) {
    logEntries.forEach((entry) => {
      emit.emit("chatMessage", {
        roomName: roomId,
        message: entry,
        sender: "System",
      });
    });
  }

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
