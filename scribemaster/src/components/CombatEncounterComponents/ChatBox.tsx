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
  const logs = useCombatStore((s) => s.logs);

  useEffect(() => {
    apiService.getCookie().then((res) => setUserName(res.user.name));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [logs]);

  // Auto-scroll to bottom on new messages

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
  );
};
