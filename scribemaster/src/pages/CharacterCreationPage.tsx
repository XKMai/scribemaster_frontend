import CharacterCreationForm from "@/components/Character/AssetCreation/CharacterCreationForm";
import PlayerCharacterCreationForm from "@/components/Character/AssetCreation/PlayerCharacterCreationForm";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/UtilityComponents/AppSidebar";
import { useState } from "react";
import { Swords } from "lucide-react";

const CharacterCreationPage = () => {
  const [choice, setChoice] = useState("");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      {choice === "general" ? (
        <CharacterCreationForm />
      ) : choice === "player" ? (
        <PlayerCharacterCreationForm />
      ) : (
        <div className="min-h-screen w-full flex flex-col items-center justify-center">
          <h1 className="text-2xl font-semibold mb-6 text-center">
            Choose a character type to create!
          </h1>
          <div className="grid grid-cols-2 gap-4">
            <Card
              className="cursor-pointer hover:shadow-xl transition duration-200 p-6 text-center w-60 h-35"
              onClick={() => setChoice("player")}
            >
              <CardContent className="flex flex-col items-center gap-4">
                <Swords className="w-12 h-12" />
                <CardTitle className="text-center">Player Character</CardTitle>
              </CardContent>
            </Card>
            <Card
              className="cursor-pointer hover:shadow-xl transition duration-200 p-6 text-center w-60 h-35"
              onClick={() => setChoice("general")}
            >
              <CardContent className="flex flex-col items-center gap-4">
                <Swords className="w-12 h-12" />
                <CardTitle>General Character</CardTitle>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </SidebarProvider>
  );
};

export default CharacterCreationPage;
