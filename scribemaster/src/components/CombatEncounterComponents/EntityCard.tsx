import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Card, CardContent } from "@/components/ui/card";
import type { EntitySummary } from "../../types/characterSchema";
import { useState } from "react";
import { Button } from "../ui/button";
import { Eye, PencilIcon, SaveIcon, Trash2Icon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import type { useSocket } from "../sockets/useSocket";

type SummaryCardProps = {
  entity: EntitySummary;
  roomId: string;
  emit: ReturnType<typeof useSocket>["emit"];
  onView?: () => void;
};

export const EntityCard: React.FC<SummaryCardProps> = ({
  entity,
  roomId,
  emit,
  onView,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [hpData, setHpData] = useState({
    hp: entity.hp,
    maxhp: entity.maxhp,
    temphp: entity.temphp,
  });
  const [loading, setLoading] = useState(false);

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card className="w-full shadow-md transition-all cursor-pointer">
          <CardContent className="p-4 space-y-2">
            <div className="text-xl font-semibold">{entity.name}</div>
            <div className="flex justify-between">
              {editMode ? (
                <form
                  className="flex flex-col gap-2"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    try {
                      emit("updateEntity", {
                        roomName: roomId,
                        entityId: entity.id,
                        updatedData: {
                          hp: hpData.hp,
                          maxhp: hpData.maxhp,
                          temphp: hpData.temphp,
                        },
                      });
                      setEditMode(false);
                    } catch (err) {
                      console.error("Failed to update HP:", err);
                      alert("Failed to update HP");
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  <div className="flex gap-2 items-center">
                    <label className="text-sm">HP:</label>
                    <input
                      type="number"
                      className="w-12 text-sm px-1 py-0.5 border rounded"
                      defaultValue={entity.hp}
                      onChange={(e) =>
                        setHpData((prev) => ({
                          ...prev,
                          hp: parseInt(e.target.value) || 0,
                        }))
                      }
                    />
                    /
                    <input
                      type="number"
                      className="w-12 text-sm px-1 py-0.5 border rounded"
                      defaultValue={entity.maxhp}
                      onChange={(e) =>
                        setHpData((prev) => ({
                          ...prev,
                          maxhp: parseInt(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <label className="text-sm">Temp HP:</label>
                    <input
                      type="number"
                      className="w-16 text-sm px-1 py-0.5 border rounded"
                      defaultValue={entity.temphp}
                      onChange={(e) =>
                        setHpData((prev) => ({
                          ...prev,
                          temphp: parseInt(e.target.value) || 0,
                        }))
                      }
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={loading}
                      className="h-6 px-2"
                    >
                      {loading ? "..." : <SaveIcon />}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-sm">
                  HP: {entity.hp} / {entity.maxhp}
                  {entity.temphp !== 0 && entity.temphp !== null && (
                    <span className="ml-2 text-blue-500">
                      (Temp HP: {entity.temphp})
                    </span>
                  )}
                </div>
              )}
              {!editMode && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setEditMode(!editMode)}
                >
                  <PencilIcon className="w-4 h-4" />
                </Button>
              )}
              {!editMode && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2Icon className="w-4 h-4 text-destructive" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm">
                    <DialogHeader>
                      <DialogTitle>Remove Entity</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to remove{" "}
                        <strong>{entity.name}</strong> from this encounter?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="secondary">Cancel</Button>
                      <Button
                        variant="destructive"
                        onClick={() =>
                          emit("removeEntity", {
                            roomName: roomId,
                            entityId: entity.id,
                          })
                        }
                      >
                        Remove
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
              <Button variant="ghost" size="icon" onClick={onView}>
                <Eye />
              </Button>
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
        {entity.spellcasting && (
          <>
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
          </>
        )}
        <div>
          <span className="font-medium">Type:</span> {entity.type}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
