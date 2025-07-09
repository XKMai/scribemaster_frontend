import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { apiService } from "@/services/apiservice";
import { isNote, type Item, type NoteData } from "@/types/TreeTypes";
import type { ItemInstance } from "@headless-tree/core";
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

      // Ask headless tree to refresh the item's data
      itemInstance.invalidateItemData();
    } catch (err) {
      console.error("Failed to update note:", err);
      alert("Failed to save changes.");
    }
  };

  return (
    <div className="w-2/3 p-4 h-full overflow-auto">
      <Card className="h-full flex flex-col">
        <CardHeader>
          {item && isNote(item) ? (
            <Input
              className="font-bold text-lg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          ) : (
            <CardTitle>Select a note to view</CardTitle>
          )}
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          {item && isNote(item) ? (
            <>
              <Textarea
                className="flex-1 text-sm"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="flex justify-end mt-2">
                <Button onClick={handleSave}>💾 Save</Button>
              </div>
            </>
          ) : (
            <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
              ...
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
