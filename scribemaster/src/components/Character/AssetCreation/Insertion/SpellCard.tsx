import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiService } from "@/services/apiservice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FolderPlus } from "lucide-react";
import type { Spell } from "@/types/spellSchema";

interface SpellCardProps {
  spell: Spell;
  availableFolders: { id: number; name: string }[];
  onDelete: (id: number) => void;
}

export const SpellCard = ({
  spell,
  availableFolders,
  onDelete,
}: SpellCardProps) => {
  const handleDelete = async () => {
    await apiService.deleteSpell(spell.id);
    onDelete(spell.id);
  };

  const handleAddToFolder = async (folderId: number) => {
    await apiService.addExistingItemToFolder({
      folderId,
      refId: spell.id,
      type: "spell",
    });
    alert(`Added spell ${spell.id} to folder ${folderId}`);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between items-start">
        <CardTitle>{spell.name}</CardTitle>
        <Button size="icon" variant="ghost" onClick={handleDelete}>
          <Trash2 className="w-4 h-4 text-red-600" />
        </Button>
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        <div>
          <strong>Level:</strong> {spell.level}
        </div>
        <div>
          <strong>School:</strong> {spell.school}
        </div>
        <div>
          <strong>Casting Time:</strong> {spell.castingTime}
        </div>
        <div>
          <strong>Range:</strong> {spell.range}
        </div>
        <div>
          <strong>Components:</strong> {spell.components.join(", ")}
        </div>
        <div>
          <strong>Duration:</strong> {spell.duration}
        </div>
        <div>
          <strong>Description:</strong> {spell.description}
        </div>
        {spell.higherLevel && (
          <div>
            <strong>At Higher Levels:</strong> {spell.higherLevel}
          </div>
        )}
        <div>
          <strong>Classes:</strong> {spell.classes.join(", ")}
        </div>
        <div className="pt-2">
          <Label>
            <FolderPlus className="w-4 h-4" />
          </Label>
          <Select onValueChange={(value) => handleAddToFolder(Number(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Select campaign" />
            </SelectTrigger>
            <SelectContent>
              {availableFolders.map((folder) => (
                <SelectItem key={folder.id} value={String(folder.id)}>
                  {folder.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
