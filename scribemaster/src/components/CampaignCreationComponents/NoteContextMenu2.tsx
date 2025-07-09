import { useState } from "react";
import { ContextMenu } from "radix-ui";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import type { Item } from "@/types/TreeTypes";
import { apiService } from "@/services/apiservice";
import type { ItemInstance } from "@headless-tree/core";

interface NoteContextMenuProps {
  itemInstance: ItemInstance<Item>;
  children: React.ReactNode;
}

export const NoteContextMenu2 = ({
  itemInstance,
  children,
}: NoteContextMenuProps) => {
  const item = itemInstance.getItemData();
  const note = item.type === "note" ? item : null;
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(note?.data.title || "");

  if (!note) return <>{children}</>;

  const renameNote = async () => {
    if (!renameValue.trim()) return;
    try {
      await apiService.updateNote(note.data.id, { title: renameValue });
      itemInstance.invalidateItemData(); // reload item
      setIsRenaming(false);
    } catch {
      alert("Failed to rename note.");
    }
  };

  const deleteNote = async () => {
    if (!confirm(`Delete "${note.data.title}"?`)) return;

    try {
      await apiService.deleteNote(item.data.id);
      const parent = itemInstance.getParent();
      if (parent) {
        parent.invalidateChildrenIds();
      }
    } catch {
      alert("Failed to delete note.");
    }
  };

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
      <ContextMenu.Content className="...">
        {!isRenaming && (
          <>
            <ContextMenu.Item
              onSelect={(e) => {
                e.preventDefault(); // prevent default radix closing
                setTimeout(() => {
                  setIsRenaming(true);
                  setRenameValue(note.data.title);
                }, 0);
              }}
            >
              ✏️ Rename Note
            </ContextMenu.Item>
            <ContextMenu.Item onSelect={deleteNote} className="text-red-600">
              🗑️ Delete Note
            </ContextMenu.Item>
          </>
        )}
        {isRenaming && (
          <div className="space-y-1 p-2">
            <Input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") renameNote();
                if (e.key === "Escape") setIsRenaming(false);
              }}
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsRenaming(false)}>
                Cancel
              </Button>
              <Button onClick={renameNote}>Rename</Button>
            </div>
          </div>
        )}
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
};
