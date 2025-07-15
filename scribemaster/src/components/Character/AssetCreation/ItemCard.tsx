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

interface ItemCardProps {
  item: {
    id: number;
    name: string;
    type: string;
    description: string;
    characteristics: Record<string, any>;
    settings?: Record<string, any>;
    createdBy: number;
  };
  availableFolders: { id: number; name: string }[];
  onDelete: (id: number) => void;
}

export const ItemCard = ({
  item,
  availableFolders,
  onDelete,
}: ItemCardProps) => {
  const handleDelete = async () => {
    await apiService.deleteItem(item.id);
    onDelete(item.id);
  };

  const handleAddToFolder = async (folderId: number) => {
    // await apiService.addItemToFolder({ itemId: item.id, folderId });
    alert(`Pretend we added item ${item.id} to folder ${folderId}`);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between items-start">
        <CardTitle>{item.name}</CardTitle>
        <Button size="icon" variant="ghost" onClick={handleDelete}>
          <Trash2 className="w-4 h-4 text-red-600" />
        </Button>
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        <div>
          <strong>Type:</strong> {item.type}
        </div>
        <div>
          <strong>Description:</strong> {item.description}
        </div>
        {item.characteristics &&
          Object.entries(item.characteristics).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong>{" "}
              {Array.isArray(value)
                ? value.join(", ")
                : typeof value === "object"
                ? JSON.stringify(value)
                : String(value)}
            </div>
          ))}
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
