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
  setRoomId: (roomId: string) => void;
};

export const useCombatStore = create<CombatState>((set, get) => ({
  entities: [],
  setEntities: (entities) => set({ entities }),

  updateEntity: (updated) => {
  const prev = get().entities.find((e) => e.id === updated.id);
  const logEntries: string[] = [];

  if (prev) {
    if (updated.hp !== prev.hp) {
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

  // Set both logs and updated entity state in a single `set` call
    set((state) => ({
  logs: [
    ...state.logs,
    ...logEntries.map((message) => ({
      sender: "System",
      message,
      timestamp: Date.now(),
    })),
  ],
  entities: state.entities.map((e) =>
    e.id === updated.id ? updated : e
  ),
}));

// Emit log entries to other clients
if (emit && roomId && logEntries.length > 0) {
  logEntries.forEach((message) => {
    emit.emit("chatMessage", {
      roomName: roomId,
      message,
      sender: "System",
    });
  });
}

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
