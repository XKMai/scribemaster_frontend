import { useState } from "react";
import { ContextMenu } from "radix-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiService } from "@/services/apiservice";
import type { Item } from "@/types/TreeTypes";
import type { ItemInstance } from "@headless-tree/core";

interface SpellContextMenuProps {
  itemInstance: ItemInstance<Item>;
  children: React.ReactNode;
}

export const SpellContextMenu = ({
  itemInstance,
  children,
}: SpellContextMenuProps) => {
  const item = itemInstance.getItemData();

  if (item.type !== "spell") return <>{children}</>;

  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(item.data.name || "");

  const renameSpell = async () => {
    if (!renameValue.trim()) return;
    try {
      await apiService.updateSpell(item.refId, { name: renameValue });
      itemInstance.invalidateItemData();
      setIsRenaming(false);
    } catch {
      alert("Failed to rename spell");
    }
  };

  const deleteSpell = async () => {
    const confirmed = window.confirm(
      `Delete spell "${item.data.name}"? This cannot be undone.`
    );
    if (!confirmed) return;
    try {
      await apiService.deleteSpell(item.refId);
      itemInstance.getParent()?.invalidateChildrenIds();
    } catch {
      alert("Failed to delete spell");
    }
  };

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
      <ContextMenu.Content className="z-50 rounded bg-white shadow-md p-2 space-y-2 min-w-[200px]">
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
              ✏️ Rename
            </ContextMenu.Item>
            <ContextMenu.Item
              className="cursor-pointer px-2 py-1 text-sm text-red-600 hover:bg-red-100"
              onSelect={deleteSpell}
            >
              🗑️ Delete
            </ContextMenu.Item>
          </>
        ) : (
          <div className="space-y-1">
            <Input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") renameSpell();
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
              <Button size="sm" onClick={renameSpell}>
                Rename
              </Button>
            </div>
          </div>
        )}
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
};
