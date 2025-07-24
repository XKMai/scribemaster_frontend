import { useState, useRef, useEffect } from "react";
import { useCombatStore } from "./combatStore";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

export const ChatBox = () => {
  const [chatInput, setChatInput] = useState("");
  const logs = useCombatStore((s) => s.logs);
  const addLog = useCombatStore((s) => s.addLog);

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = chatInput.trim();
    if (!trimmed) return;

    addLog(
      {
        sender: "You",
        message: trimmed,
        timestamp: Date.now(),
      },
      true // emit to room
    );

    setChatInput("");
  };

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <ScrollArea className="flex-1 border border-border rounded-md px-2 py-2 pb-1">
        <div
          ref={scrollRef}
          className="space-y-1 text-sm text-muted-foreground pb-2"
        >
          {logs.map((log, index) => (
            <div key={index}>
              • <strong>{log.sender}:</strong> {log.message}{" "}
              <span className="text-xs text-muted-foreground">
                ({new Date(log.timestamp).toLocaleTimeString()})
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Chat Input */}
      <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
        <Input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Send a message..."
          className="flex-1"
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
};
