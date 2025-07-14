import { useState } from "react";
import { ContextMenu } from "radix-ui";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { apiService } from "@/services/apiservice";
import type { Item } from "@/types/TreeTypes";
import type { ItemInstance } from "@headless-tree/core";

interface EntityContextMenuProps {
  itemInstance: ItemInstance<Item>;
  children: React.ReactNode;
}

export const EntityContextMenu = ({
  itemInstance,
  children,
}: EntityContextMenuProps) => {
  const item = itemInstance.getItemData();
  const entity =
    item.type === "entity" ? item : item.type === "player" ? item : null;
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(entity?.data.name || "");

  if (!entity) return <>{children}</>;

  const renameEntity = async () => {
    if (!renameValue.trim()) return;
    try {
      await apiService.updateFolder(entity.refId, { name: renameValue });
      itemInstance.invalidateItemData();
      setIsRenaming(false);
    } catch {
      alert("Failed to rename folder");
    }
  };

  const deleteEntity = async () => {
    const confirmed = window.confirm(
      `Delete folder "${entity.data.name}"? This cannot be undone.`
    );
    if (!confirmed) return;
    try {
      await apiService.deleteFolder(entity.refId);
      const parent = itemInstance.getParent();
      parent?.invalidateChildrenIds();
    } catch {
      alert("Failed to delete folder");
    }
  };

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
      <ContextMenu.Content className="z-50 rounded bg-white shadow-md p-2 space-y-2 min-w-[200px]">
        {!isRenaming && (
          <>
            <ContextMenu.Item
              className="cursor-pointer px-2 py-1 text-sm hover:bg-muted"
              onSelect={(e) => {
                e.preventDefault(); // prevent default radix closing
                setTimeout(() => {
                  setIsRenaming(true);
                  setRenameValue(entity.data.name);
                }, 0);
              }}
            >
              ✏️ Rename
            </ContextMenu.Item>
            <ContextMenu.Item
              className="cursor-pointer px-2 py-1 text-sm text-red-600 hover:bg-red-100"
              onSelect={deleteEntity}
            >
              🗑️ Delete
            </ContextMenu.Item>
          </>
        )}

        {isRenaming && (
          <div className="space-y-1">
            <Input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") renameEntity();
                if (e.key === "Escape") setIsRenaming(false);
              }}
              autoFocus
            />
            <div className="flex justify-end space-x-2 pt-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsRenaming(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={renameEntity}>
                Rename
              </Button>
            </div>
          </div>
        )}
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
};
