import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import type { EntitySummary } from "@/types/characterSchema";

type ServerToClientEvents = {
  entity_update: (entity: EntitySummary) => void;
  roomData: (payload: { entityIds: number[]; entities: EntitySummary[] }) => void;
};

type ClientToServerEvents = {
  joinRoom: (roomId: string) => void;
  addEntity: (payload: { roomName: string; entityId: number }) => void;
  removeEntity: (payload: { roomName: string; itemId: number }) => void;
};

export const useSocket = (
  roomId: string,
  {
    onEntityUpdate,
    onRoomData,
  }: {
    onEntityUpdate: (entity: EntitySummary) => void;
    onRoomData: (payload: { entityIds: number[]; entities: EntitySummary[] }) => void;
  }
) => {
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

    // only create socket once
   if (!socketRef.current) { 
    socketRef.current = io("http://localhost:5000", {
      withCredentials: true,
    });
    console.log("🔌 Connecting to socket server...");
  }

  useEffect(() => {
    const socket = socketRef.current!;

    
    socketRef.current = socket;

    const handleConnect = () => {
      console.log("✅ Socket connected:", socket.id);
      socket.emit("joinRoom", roomId);
      console.log("📡 Emitting joinRoom:", roomId);
    };

    socket.on("connect", handleConnect);
    socket.on("entity_update", onEntityUpdate);
    socket.on("roomData", onRoomData);

    // If already connected, manually join
    if (socket.connected) {
      handleConnect();
    }

    return () => {
        socket.off("connect", handleConnect);
        socket.off("entity_update", onEntityUpdate);
        socket.off("roomData", onRoomData);
        //socket.disconnect();
    };
  }, []);

  return {
    emit: <K extends keyof ClientToServerEvents>(
      event: K,
      ...args: Parameters<ClientToServerEvents[K]> 
    ) => {
      socketRef.current?.emit(event, ...args);
    },
    socket: socketRef.current,
  };
};
