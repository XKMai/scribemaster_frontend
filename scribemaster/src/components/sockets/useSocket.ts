import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import type { EntitySummary } from "@/types/characterSchema";
import type { PlayerCharacter } from "@/types/playerCharacterSchema";

type ServerToClientEvents = {
  roomData: (payload: {
    entityIds: number[];
    entities: EntitySummary[];
  }) => void;
  entityUpdated: (payload: { updatedEntity: EntitySummary }) => void;
  chatMessage: (payload: {
    sender: string;
    message: string;
    timestamp: number;
  }) => void;
};

type ClientToServerEvents = {
  joinRoom: (roomId: string) => void;
  addEntity: (payload: { roomName: string; entityId: number }) => void;
  removeEntity: (payload: { roomName: string; entityId: number }) => void;
  updateEntity: (payload: {
    roomName: string;
    entityId: number;
    updatedData: Partial<PlayerCharacter>;
  }) => void;
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
    onRoomData: (payload: {
      entityIds: number[];
      entities: EntitySummary[];
    }) => void;
  }
) => {
  const socketRef = useRef<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);

  useEffect(() => {
    // only create socket once
    if (!socketRef.current) {
      socketRef.current = io(
        import.meta.env.VITE_API_URL ||
          "http://scribemaster-frontend-alb-469534981.ap-southeast-1.elb.amazonaws.com/api",
        {
          withCredentials: true,
        }
      );
    }

    const socket = socketRef.current!;

    const handleConnect = () => {
      socket.emit("joinRoom", roomId);
    };

    const handleEntityUpdated = ({
      updatedEntity,
    }: {
      updatedEntity: EntitySummary;
    }) => {
      onEntityUpdated(updatedEntity);
    };

    const handleRoomData = (data: {
      entityIds: number[];
      entities: EntitySummary[];
    }) => {
      if (!data || !Array.isArray(data.entities)) {
        return;
      }
      onRoomData(data);
    };

    socket.off("connect", handleConnect);
    socket.off("entityUpdated", handleEntityUpdated);
    socket.off("roomData", handleRoomData);

    socket.on("connect", handleConnect);
    socket.on("entityUpdated", handleEntityUpdated);
    socket.on("roomData", handleRoomData);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("entityUpdated", handleEntityUpdated);
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
