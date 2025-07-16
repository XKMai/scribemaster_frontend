import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { apiService } from "@/services/apiservice";
import { isEntity, isItem, isNote, type Item } from "@/types/TreeTypes";
import type { ItemInstance } from "@headless-tree/core";
import { Save } from "lucide-react";
import { EntityViewerForm } from "./EntityViewer";
import { ItemViewerForm } from "./ItemViewer";
//import type { ItemInstance } from "@headless-tree/react";

interface ContentViewerProps {
  itemInstance: ItemInstance<Item> | null;
}

export const ContentViewer = ({ itemInstance }: ContentViewerProps) => {
  const item = itemInstance?.getItemData();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (item && isNote(item)) {
      setTitle(item.data.title);
      setContent(item.data.content);
    }
  }, [item]);

  const handleSave = async () => {
    if (!itemInstance || !item || !isNote(item)) return;

    try {
      await apiService.updateNote(item.data.id, {
        title,
        content,
      });

      itemInstance.invalidateItemData();
    } catch (err) {
      console.error("Failed to update note:", err);
      alert("Failed to save changes.");
    }
  };

  return (
    <div className="w-full h-full p-4">
      <Card className="w-full h-full flex flex-col">
        <CardHeader>
          {item ? (
            isNote(item) ? (
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            ) : isEntity(item) ? (
              <CardTitle>{item.data.name}</CardTitle>
            ) : (
              <CardTitle>Unsupported item</CardTitle>
            )
          ) : (
            <CardTitle>Select an item to view</CardTitle>
          )}
        </CardHeader>

        {/* Scrollable content inside fixed height */}
        <CardContent className="flex-1 overflow-y-auto overflow-x-hidden space-y-4">
          {item ? (
            isNote(item) ? (
              <>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button variant="ghost" onClick={handleSave}>
                    <Save /> Save
                  </Button>
                </div>
              </>
            ) : isEntity(item) && itemInstance ? (
              <EntityViewerForm itemInstance={itemInstance} />
            ) : isItem(item) && itemInstance ? (
              <ItemViewerForm itemInstance={itemInstance} />
            ) : (
              <pre className="text-sm text-muted-foreground">
                Unsupported content type.
              </pre>
            )
          ) : (
            <pre className="text-sm text-muted-foreground">...</pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
