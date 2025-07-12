import CharacterCreationForm from "@/components/Character/AssetCreation/CharacterCreationForm";
import PlayerCharacterCreationForm from "@/components/Character/AssetCreation/PlayerCharacterCreationForm";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/UtilityComponents/AppSidebar";
import { useState } from "react";
import { Sword, PawPrint, WandSparkles, Gem } from "lucide-react";
import SpellCreationForm from "@/components/Character/AssetCreation/CreationForms/SpellCreationForm";
import ItemCreationForm from "@/components/Character/AssetCreation/CreationForms/ItemCreationForm";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

const CharacterCreationPage = () => {
  const [choice, setChoice] = useState("");
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      {choice === "general" ? (
        <CharacterCreationForm />
      ) : choice === "item" ? (
        <ItemCreationForm />
      ) : choice === "player" ? (
        <PlayerCharacterCreationForm />
      ) : choice === "spell" ? (
        <SpellCreationForm />
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
                <Sword className="w-12 h-12" />
                <CardTitle className="text-center">Player Character</CardTitle>
              </CardContent>
            </Card>
            <Card
              className="cursor-pointer hover:shadow-xl transition duration-200 p-6 text-center w-60 h-35"
              onClick={() => setChoice("general")}
            >
              <CardContent className="flex flex-col items-center gap-4">
                <PawPrint className="w-12 h-12" />
                <CardTitle>General Character</CardTitle>
              </CardContent>
            </Card>
            <Card
              className="cursor-pointer hover:shadow-xl transition duration-200 p-6 text-center w-60 h-35"
              onClick={() => setChoice("spell")}
            >
              <CardContent className="flex flex-col items-center gap-4">
                <WandSparkles className="w-12 h-12" />
                <CardTitle className="text-center">Spell</CardTitle>
              </CardContent>
            </Card>
            <Card
              className="cursor-pointer hover:shadow-xl transition duration-200 p-6 text-center w-60 h-35"
              onClick={() => setChoice("item")}
            >
              <CardContent className="flex flex-col items-center gap-4">
                <Gem className="w-12 h-12" />
                <CardTitle className="text-center">Item</CardTitle>
              </CardContent>
            </Card>
          </div>
          <div className="p-5">
            <Button onClick={() => navigate("/characterinsertion")}>
              Insert your current assets into your campaigns!
            </Button>
          </div>
        </div>
      )}
    </SidebarProvider>
  );
};

export default CharacterCreationPage;
