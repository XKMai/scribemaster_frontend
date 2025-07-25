import { useState } from "react";
import { useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
//import axios from "axios";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/UtilityComponents/AppSidebar";

export default function CombatLobbyPage() {
  const [sessionId, setSessionId] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (sessionId.trim()) {
      navigate(`/combat/${sessionId}`);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <div className="flex h-screen w-full">
        <div className="m-auto flex flex-col items-center justify-center h-screen gap-4 p-4">
          <h1 className="text-2xl font-bold">
            Join or Create a Combat Session
          </h1>

          <Input
            placeholder="Enter Session ID"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex gap-2">
            <Button onClick={handleJoin}>Join Session</Button>
            <Button onClick={handleJoin} variant="secondary">
              Create New Session
            </Button>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
