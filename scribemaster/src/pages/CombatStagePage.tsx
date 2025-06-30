import type { EntitySummary } from "@/components/Character/AssetCreation/characterSchema";
import { EntityCard } from "@/components/CombatEncounterComponents/EntityCard";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/UtilityComponents/AppSidebar";
import { DiceBoard } from "@/components/UtilityComponents/DiceBoard";

const CombatStagePage = () => {
  const sampleEntity: EntitySummary = {
    id: 1,
    name: "Tharion the Brave",
    hp: 42,
    maxhp: 60,
    ac: 17,
    stats: {
      strength: 16,
      dexterity: 14,
      constitution: 15,
      intelligence: 10,
      wisdom: 12,
      charisma: 13,
    },
    speed: 30,
    passivePerception: 14,
    spellcasting: {
      spellcastingAbility: "Charisma",
      spellSaveDC: 13,
      spellAttackBonus: 5,
    },
    type: "friendly",
  };
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
              {/* <Card>
                <CardContent className="p-4">Left side combatant</CardContent>
              </Card> */}
              <EntityCard entity={sampleEntity} />
              {/* Add more cards here */}
            </CardContent>
          </Card>

          {/* Middle Dice Roller */}
          <div className="flex items-start justify-center w-full pt-4">
            <DiceBoard />
          </div>

          {/* Right Column */}
          <Card className="flex flex-col w-[400px] h-full overflow-hidden">
            <CardContent className="flex flex-col space-y-4 h-full overflow-y-auto p-4">
              <Card>
                <CardContent className="p-4">Right side combatant</CardContent>
              </Card>
              {/* Add more cards here */}
            </CardContent>
          </Card>
        </div>

        {/* Bottom: Command Card */}
        <Card className="w-full max-w-[764px] mx-auto mt-4">
          <CardContent className="p-4 text-center">
            Command bar content
          </CardContent>
        </Card>
      </div>
    </SidebarProvider>
  );
};

export default CombatStagePage;
