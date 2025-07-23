import { EntityCard } from "@/components/CombatEncounterComponents/EntityCard";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/UtilityComponents/AppSidebar";
import { DiceBoard } from "@/components/UtilityComponents/DiceBoard";
import { useSocket } from "@/components/sockets/useSocket";
import { useCombatStore } from "@/components/CombatEncounterComponents/combatStore";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { apiService } from "@/services/apiservice";
import { ScrollArea } from "@/components/ui/scroll-area";

const CombatStagePage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const entities = useCombatStore((state) => state.entities);
  const setEntities = useCombatStore((state) => state.setEntities);
  const updateEntity = useCombatStore((state) => state.updateEntity);
  const [userId, setUserId] = useState<number | null>(null);
  useEffect(() => {
    apiService.getCookie().then((res) => setUserId(res.user.id));
  }, []);

  const socketRef = useRef<ReturnType<typeof useSocket> | null>(null);
  socketRef.current = useSocket(roomId ?? "", {
    onEntityUpdate: updateEntity,
    onRoomData: ({ entities }) => {
      console.log("🧠 Received roomData:", entities);
      setEntities(entities);
    },
  });

  const addUserEntitiesToRoom = async () => {
    if (!roomId || userId === null) return;
    try {
      const entityIds: number[] = await apiService.getEntityIds(userId);
      console.log("📤 Adding user's entities:", entityIds);
      for (const entityId of entityIds) {
        emit("addEntity", { roomName: roomId, entityId });
      }
    } catch (err) {
      console.error("Failed to fetch or add user entities", err);
    }
  };

  const { emit } = socketRef.current;

  const leaveSession = () => {
    console.log("🚪 Leaving session...");
    socketRef.current?.socket.disconnect();

    navigate("/combatlobby");
  };

  const addTestEntity = () => {
    if (roomId) {
      console.log("🛠 Emitting addEntity for room:", roomId, "entityId: 10");
      emit("addEntity", { roomName: roomId, entityId: 10 });
    }
  };

  const leftSide = (entities ?? []).filter((e) => e.type === "friendly");
  const rightSide = (entities ?? []).filter((e) => e.type === "enemy");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <div className="relative flex flex-col h-screen w-full px-4 bg-muted overflow-hidden">
        {/* Top: Left & Right Columns */}
        <div className="flex justify-between gap-8 flex-1 overflow-hidden">
          {/* Left Column */}
          <Card className="flex flex-col w-[400px] h-full overflow-hidden">
            <CardContent className="flex flex-col space-y-4 h-full overflow-y-auto p-4">
              {leftSide.map((entity) => (
                <EntityCard key={entity.id} entity={entity} />
              ))}
            </CardContent>
          </Card>

          {/* Middle Dice Roller */}
          <div className="flex items-start justify-center w-full pt-4">
            <DiceBoard />
            <div className="flex flex-col items-center space-y-2">
              <Button onClick={addUserEntitiesToRoom} className="m-1">
                + Add My Entities
              </Button>
              <Button
                onClick={addTestEntity}
                className="m-1"
                disabled={userId === null}
              >
                + Add Test Entity
              </Button>
              <Button
                variant="destructive"
                className="ml-4 self-end"
                onClick={leaveSession}
              >
                Leave Session
              </Button>
            </div>
          </div>

          {/* Right Column */}
          <Card className="flex flex-col w-[400px] h-full overflow-hidden">
            <CardContent className="flex flex-col space-y-4 h-full overflow-y-auto p-4">
              {rightSide.map((entity) => (
                <EntityCard key={entity.id} entity={entity} />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Bottom: Command Card */}
        <div className="flex justify-between items-end w-full max-w-[764px] mx-auto mt-4 mb-4">
          <Card className="flex-1 h-60 overflow-hidden">
            <CardTitle>
              <div className="text-sm font-semibold text-center">
                Combat Log
              </div>
            </CardTitle>
            <CardContent className="h-full flex flex-col border-red-500 mb-1">
              <ScrollArea className="h-full overflow-y-auto ">
                <div className="space-y-1 text-sm text-muted-foreground">
                  {useCombatStore((s) => s.logs).map((log, index) => (
                    <div key={index}>{log}</div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CombatStagePage;
