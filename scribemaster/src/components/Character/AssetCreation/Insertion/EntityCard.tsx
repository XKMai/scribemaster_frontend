import { useEffect, useState } from "react";
import { Trash2, FolderPlus } from "lucide-react";
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

interface EntityCardProps {
  entityId: number;
  availableFolders: { id: number; name: string }[];
  onDelete: (id: number) => void;
}

export const EntityCard = ({
  entityId,
  availableFolders,
  onDelete,
}: EntityCardProps) => {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await apiService.getEntitySummary(entityId);
        setSummary(data);
      } catch (err) {
        console.error(`Failed to fetch entity ${entityId}:`, err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [entityId]);

  const handleDelete = async () => {
    await apiService.deleteEntity(entityId);
    onDelete(entityId);
  };

  const handleAddToFolder = async (folderId: number) => {
    try {
      await apiService.addEntityToFolder({ entityId, folderId });
      alert("Added to folder!");
    } catch (err) {
      console.error("Failed to add to folder:", err);
      alert("Failed to add entity to folder.");
    }
  };

  if (loading) return <Card className="w-full">Loading...</Card>;
  if (!summary) return null;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between items-start">
        <CardTitle>{summary.name}</CardTitle>
        <Button size="icon" variant="ghost" onClick={handleDelete}>
          <Trash2 className="w-4 h-4 text-red-600" />
        </Button>
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        <div>
          HP: {summary.hp} / {summary.maxhp}
        </div>
        <div>AC: {summary.ac}</div>
        <div>Speed: {summary.speed} ft</div>
        <div>Passive Perception: {summary.passivePerception}</div>
        {summary.level && summary.characterClass && (
          <div>
            <div>Level: {summary.level}</div>
            <div>Class: {summary.characterClass}</div>
          </div>
        )}
        <div className="pt-2 flex justify-items-center gap-2">
          <Label>
            <FolderPlus className="size-6" />
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
