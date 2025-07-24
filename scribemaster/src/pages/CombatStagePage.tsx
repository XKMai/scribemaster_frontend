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
import { ScrollArea } from "@/components/ui/scroll-area";
import { CampaignEntityAdder } from "@/components/CombatEncounterComponents/CampaignEntityAdder";
import { EntityCombatViewer } from "@/components/CombatEncounterComponents/EntityCombatViewer";
import { Input } from "@/components/ui/input";
import { apiService } from "@/services/apiservice";

const CombatStagePage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const entities = useCombatStore((state) => state.entities);
  const setEntities = useCombatStore((state) => state.setEntities);
  const updateEntity = useCombatStore((state) => state.updateEntity);
  const [selectedEntityId, setSelectedEntityId] = useState<number | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    apiService.getCookie().then((res) => setUserName(res.user.name));
  }, []);

  const socketRef = useRef<ReturnType<typeof useSocket> | null>(null);
  socketRef.current = useSocket(roomId ?? "", {
    onEntityUpdated: updateEntity,
    onRoomData: ({ entities }) => {
      console.log("🧠 Received roomData:", entities);
      setEntities(entities);
    },
  });

  const { emit } = socketRef.current;

  const leaveSession = () => {
    console.log("🚪 Leaving session...");
    socketRef.current?.socket.disconnect();

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
          <Card className="h-60 w-full max-w-[764px] mx-auto">
            <CardTitle>
              <div className="text-sm font-semibold text-center">
                Combat Log
              </div>
            </CardTitle>
            <CardContent className="h-full px-3 pb-1 flex flex-col">
              <ScrollArea className="flex-1 border border-border rounded-md px-2 py-2 pb-1">
                <div className="space-y-1 text-sm text-muted-foreground pb-2">
                  {useCombatStore((s) => s.logs).map((log, index) => (
                    <div key={index}>
                      • <strong>{log.sender}:</strong> {log.message}{" "}
                      <span className="text-xs text-muted-foreground">
                        ({new Date(log.timestamp).toLocaleTimeString()})
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!chatInput.trim()) return;

                  useCombatStore.getState().addLog(
                    {
                      sender: userName ?? "You",
                      message: chatInput,
                      timestamp: Date.now(),
                    },
                    true // emit to room
                  );

                  setChatInput("");
                }}
                className="flex gap-2 mt-2"
              >
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Send a message..."
                  className="flex-1"
                />
                <Button type="submit">Send</Button>
              </form>
            </CardContent>
          </Card>

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
