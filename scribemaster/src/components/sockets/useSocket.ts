import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import type { EntitySummary } from "@/types/characterSchema";
import type { PlayerCharacter } from "@/types/playerCharacterSchema";
import { useCombatStore } from "../CombatEncounterComponents/combatStore";

type ServerToClientEvents = {
  roomData: (payload: { entityIds: number[]; entities: EntitySummary[] }) => void;
  entityUpdated: (payload: { entityId: number; updatedEntity: EntitySummary }) => void;
  chatMessage: (payload: {
    sender: string;
    message: string;
    timestamp: number;
  }) => void;
};

type ClientToServerEvents = {
  joinRoom: (roomId: string) => void;
  addEntity: (payload: { roomName: string; entityId: number }) => void;
  removeEntity: (payload: { roomName: string; itemId: number }) => void;
  updateEntity: (payload: {
    roomName: string;
    entityId: number;
    updatedData: Partial<PlayerCharacter>;
  }) => void
  chatMessage: (payload: {
    roomName: string;
    sender: string;
    message: string;
  }) => void;

};

export const useSocket = (
  roomId: string,
  {
    onEntityUpdated,
    onRoomData,
  }: {
    onEntityUpdated: (entity: EntitySummary) => void;
    onRoomData: (payload: { entityIds: number[]; entities: EntitySummary[] }) => void;
  }
) => {
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

   

  useEffect(() => {

     // only create socket once
   if (!socketRef.current) { 
    socketRef.current = io("http://localhost:5000", {
      withCredentials: true,
    });
    console.log("🔌 Connecting to socket server...");
  }

    const socket = socketRef.current!;

    const handleConnect = () => {
      console.log("✅ Socket connected:", socket.id);
      socket.emit("joinRoom", roomId);
      console.log("📡 Emitting joinRoom:", roomId);
    };

    const handleEntityUpdated = ({ entityId, updatedEntity }: { entityId: number; updatedEntity: EntitySummary }) => {
      console.log("📥 Received entityUpdated:", updatedEntity.name);
      onEntityUpdated(updatedEntity);
    };

    const handleRoomData = (data: { entityIds: number[]; entities: EntitySummary[] }) => {
      console.log("📥 Received roomData:", data.entities.length, "entities");
      onRoomData(data);
    };

    const handleChatMessage = ({ sender, message, timestamp }: { sender: string; message: string; timestamp: number }) => {
      console.log("📥 Received chatMessage from server:", { sender, message });
      useCombatStore.getState().addLog({ sender, message, timestamp });
    };

    socket.off("connect");
    socket.off("entityUpdated");
    socket.off("roomData");
    //socket.off("chatMessage");

    socket.on("connect", handleConnect);
    socket.on("entityUpdated", handleEntityUpdated);
    socket.on("roomData", handleRoomData);
    //socket.on("chatMessage", handleChatMessage);



    // If already connected, manually join
    if (socket.connected) {
      handleConnect();
    }

    return () => {
        socket.off("connect", handleConnect);
        socket.off("entityUpdated");
        socket.off("roomData", onRoomData);
        //socket.off("chatMessage");

        //socket.disconnect();
    };
  }, [roomId, onEntityUpdated, onRoomData]);

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
