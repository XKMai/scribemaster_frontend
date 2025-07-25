import { EntityCard } from "@/components/CombatEncounterComponents/EntityCard";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/UtilityComponents/AppSidebar";
import { DiceBoard } from "@/components/UtilityComponents/DiceBoard";
import { useSocket } from "@/components/sockets/useSocket";
import { useCombatStore } from "@/components/CombatEncounterComponents/combatStore";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { CampaignEntityAdder } from "@/components/CombatEncounterComponents/CampaignEntityAdder";
import { EntityCombatViewer } from "@/components/CombatEncounterComponents/EntityCombatViewer";
import { ChatBox } from "@/components/CombatEncounterComponents/ChatBox";

const CombatStagePage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const entities = useCombatStore((state) => state.entities);
  const setEntities = useCombatStore((state) => state.setEntities);
  const updateEntity = useCombatStore((state) => state.updateEntity);
  const [selectedEntityId, setSelectedEntityId] = useState<number | null>(null);

  const { emit, socket } = useSocket(roomId ?? "", {
    onEntityUpdated: updateEntity,
    onRoomData: ({ entities }) => {
      setEntities(entities);
    },
  });

  useEffect(() => {
    if (socket && roomId) {
      useCombatStore.getState().setSocket(socket);
      useCombatStore.getState().setRoomId(roomId);
    }
  }, [socket, roomId]);

  const leaveSession = () => {
    socket?.disconnect();

    useCombatStore.getState().setSocket(null);
    useCombatStore.getState().setRoomId(null);

    navigate("/combatlobby");
  };

  const leftSide = (entities ?? []).filter(
    (e) => e.type === "friendly" || e.type === "player" || e.type === "neutral"
  );
  const rightSide = (entities ?? []).filter((e) => e.type === "enemy");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <div className="relative flex flex-col h-screen w-full px-4 bg-muted overflow-hidden">
        {/* Main Body: Three Columns */}
        <div className="flex justify-between gap-8 flex-1 overflow-hidden">
          {/* Left Column */}
          <Card className="flex flex-col w-[400px] h-full overflow-hidden">
            <CardContent className="flex flex-col space-y-4 h-full overflow-y-auto p-4">
              {leftSide.map((entity) => (
                <EntityCard
                  key={entity.id}
                  entity={entity}
                  roomId={roomId!}
                  emit={emit}
                  onView={() => setSelectedEntityId(entity.id)}
                />
              ))}
            </CardContent>
          </Card>

          {/* Center Column: Viewer + Adder */}
          <div className="flex flex-col w-full max-w-[600px] h-full space-y-4 overflow-y-auto pt-4 items-center">
            <CampaignEntityAdder roomId={roomId!} emit={emit} />
            {selectedEntityId ? (
              <EntityCombatViewer
                entityId={selectedEntityId}
                emit={emit}
                roomId={roomId!}
                setEntityId={setSelectedEntityId}
              />
            ) : (
              <Card className="w-full p-4 text-center text-muted-foreground text-sm">
                Select an entity to view details
              </Card>
            )}
          </div>

          {/* Right Column */}
          <Card className="flex flex-col w-[400px] h-full overflow-hidden">
            <CardContent className="flex flex-col space-y-4 h-full overflow-y-auto p-4">
              {rightSide.map((entity) => (
                <EntityCard
                  key={entity.id}
                  entity={entity}
                  roomId={roomId!}
                  emit={emit}
                  onView={() => setSelectedEntityId(entity.id)}
                />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row: Combat Log (centered) + Leave Button (right) */}
        <div className="flex justify-between items-end w-full mt-4 mb-4 px-2">
          {/* Spacer for left alignment balance */}
          <div className="w-[200px]" />

          {/* Centered Combat Log */}
          <ChatBox />

          {/* Right-aligned Leave Button */}
          <div className="w-[200px] flex justify-end">
            <Button
              variant="destructive"
              className="self-end"
              onClick={leaveSession}
            >
              Leave Session
            </Button>
          </div>
        </div>

        <div className="absolute bottom-4 left-4">
          <DiceBoard />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CombatStagePage;
