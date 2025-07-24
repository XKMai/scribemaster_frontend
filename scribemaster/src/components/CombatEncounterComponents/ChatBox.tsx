import { useState, useRef, useEffect } from "react";
import { useCombatStore } from "./combatStore";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardTitle, CardContent } from "../ui/card";
import { apiService } from "@/services/apiservice";

export const ChatBox = () => {
  const [chatInput, setChatInput] = useState("");
  const [userName, setUserName] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const socket = useCombatStore((s) => s.socket);
  const roomId = useCombatStore((s) => s.roomId);
  const logs = useCombatStore((s) => s.logs);

  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = ({
      sender,
      message,
      timestamp,
    }: {
      sender: string;
      message: string;
      timestamp: number;
    }) => {
      console.log("📥 ChatBox received chatMessage:", {
        sender,
        message,
        timestamp,
      });
      useCombatStore.getState().addLog({ sender, message, timestamp });
    };

    socket.on("chatMessage", handleIncomingMessage);

    return () => {
      socket.off("chatMessage", handleIncomingMessage);
    };
  }, [socket]);

  useEffect(() => {
    apiService.getCookie().then((res) => setUserName(res.user.name));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [logs]);

  return (
    <Card className="h-60 w-full max-w-[764px] mx-auto">
      <CardTitle>
        <div className="text-sm font-semibold text-center">Combat Log</div>
      </CardTitle>
      <CardContent className="h-4/5 px-3 pb-1 flex flex-col">
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full border border-border rounded-md px-2 pb-1">
            <div className="space-y-1 text-sm text-muted-foreground">
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
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            //if (!chatInput.trim() || !socket || !roomId) return;

            console.log("Form submitted");
            console.log("chatInput:", chatInput);
            console.log("socket:", socket);
            console.log("roomId:", roomId);
            console.log("userName:", userName);

            if (!chatInput.trim()) {
              console.log("❌ Empty chat input");
              return;
            }

            if (!socket) {
              console.log("❌ No socket connection");
              return;
            }

            if (!roomId) {
              console.log("❌ No room ID");
              return;
            }

            const messagePayload = {
              roomName: roomId,
              sender: userName ?? "You",
              message: chatInput,
            };

            console.log("📤 Emitting chatMessage:", messagePayload);

            socket.emit("chatMessage", messagePayload);

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
  );
};
