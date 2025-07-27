import { useState } from "react";
import { ContextMenu } from "radix-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiService } from "@/services/apiservice";
import type { Item } from "@/types/TreeTypes";
import type { ItemInstance } from "@headless-tree/core";
import { PencilIcon, Trash } from "lucide-react";

interface ItemContextMenuProps {
  itemInstance: ItemInstance<Item>;
  children: React.ReactNode;
}

export const ItemContextMenu = ({
  itemInstance,
  children,
}: ItemContextMenuProps) => {
  const item = itemInstance.getItemData();

  if (item.type !== "item") return <>{children}</>;

  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(item.data.name || "");

  const renameItem = async () => {
    if (!renameValue.trim()) return;
    try {
      await apiService.updateItem(item.refId, { name: renameValue }); // if supported
      itemInstance.invalidateItemData();
      setIsRenaming(false);
    } catch {
      alert("Failed to rename item");
    }
  };

  const deleteItem = async () => {
    const confirmed = window.confirm(
      `Delete item "${item.data.name}"? This cannot be undone.`
    );
    if (!confirmed) return;
    try {
      await apiService.deleteItem(item.refId);
      const parent = itemInstance.getParent();
      parent?.invalidateChildrenIds();
    } catch {
      alert("Failed to delete item");
    }
  };

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
      <ContextMenu.Content className="z-50 rounded shadow-md p-2 space-y-2 min-w-[150px] bg-muted">
        {!isRenaming ? (
          <>
            <ContextMenu.Item
              className="cursor-pointer px-2 py-1 text-sm hover:bg-muted"
              onSelect={(e) => {
                e.preventDefault();
                setTimeout(() => {
                  setIsRenaming(true);
                  setRenameValue(item.data.name);
                }, 0);
              }}
            >
              <div className="flex items-center gap-2">
                <PencilIcon className="size-4" />
                Rename
              </div>
            </ContextMenu.Item>
            <ContextMenu.Item
              className="cursor-pointer px-2 py-1 text-sm text-red-600 hover:bg-red-100"
              onSelect={deleteItem}
            >
              <div className="flex items-center gap-2">
                <Trash className="size-4" />
                Delete
              </div>
            </ContextMenu.Item>
          </>
        ) : (
          <div className="space-y-1">
            <Input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") renameItem();
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
              <Button size="sm" onClick={renameItem}>
                Rename
              </Button>
            </div>
          </div>
        )}
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
};
