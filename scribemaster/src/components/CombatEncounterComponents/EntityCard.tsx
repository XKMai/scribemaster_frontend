import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Card, CardContent } from "@/components/ui/card";
import type { EntitySummary } from "../../types/characterSchema";

type SummaryCardProps = {
  entity: EntitySummary;
};

export const EntityCard: React.FC<SummaryCardProps> = ({ entity }) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card className="w-full shadow-md transition-all cursor-pointer">
          <CardContent className="p-4 space-y-2">
            <div className="text-xl font-semibold">{entity.name}</div>
            <div className="text-sm text-muted-foreground">
              HP: {entity.hp} / {entity.maxhp}
            </div>

            <div className="grid grid-cols-3 gap-1 text-xs">
              {Object.entries(entity.stats).map(([stat, value]) => (
                <div key={stat} className="capitalize">
                  {stat.slice(0, 3)}: {value}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </HoverCardTrigger>

      <HoverCardContent className="w-72 text-sm space-y-1">
        <div>
          <span className="font-medium">AC:</span> {entity.ac}
        </div>
        <div>
          <span className="font-medium">Speed:</span> {entity.speed}
        </div>
        <div>
          <span className="font-medium">Passive Perception:</span>{" "}
          {entity.passivePerception}
        </div>
        <div>
          <span className="font-medium">Spellcasting:</span>{" "}
          {entity.spellcasting.spellcastingAbility}
        </div>
        <div>
          <span className="font-medium">Spell Save DC:</span>{" "}
          {entity.spellcasting.spellSaveDC}
        </div>
        <div>
          <span className="font-medium">Spell Attack:</span>{" "}
          {entity.spellcasting.spellAttackBonus}
        </div>
        <div>
          <span className="font-medium">Type:</span> {entity.type}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
