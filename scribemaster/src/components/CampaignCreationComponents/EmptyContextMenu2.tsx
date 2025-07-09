import { useState, useRef } from "react";
import { ContextMenu } from "radix-ui";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { apiService } from "@/services/apiservice";
import type { Item } from "@/types/TreeTypes";
import type { TreeInstance } from "@headless-tree/core";

interface EmptyContextMenuProps {
  tree: TreeInstance<Item>;
  rootFolderId: number;
  children: React.ReactNode;
}

export const EmptyContextMenu2 = ({
  tree,
  rootFolderId,
  children,
}: EmptyContextMenuProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [creatingType, setCreatingType] = useState<"note" | "folder" | null>(
    null
  );
  const [newName, setNewName] = useState("");

  const handleContextMenu = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest(".tree-item")) return; // avoid overriding item context menus
    e.preventDefault();
    setCreatingType(null);
    setNewName("");
  };

  const handleCreate = async () => {
    if (!newName.trim() || !creatingType) return;

    const folderId = rootFolderId;
    const user = await apiService.getCookie();

    try {
      if (creatingType === "note") {
        await apiService.createNote({
          title: newName,
          content: "",
          createdBy: user.user.id,
          folderId,
        });
      }

      if (creatingType === "folder") {
        await apiService.createFolder({
          name: newName,
          createdBy: user.user.id,
          folderId,
        });
      }

      const root = tree.getItemInstance(`folder-${rootFolderId}`);
      if (root) {
        if (!root.isExpanded()) {
          await root.expand(); // fetch fresh children
        } else {
          await root.invalidateChildrenIds(); // force refresh
        }
      }

      setNewName("");
      setCreatingType(null);
    } catch (err) {
      alert("Failed to create item");
      console.error(err);
    }
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      ref={containerRef}
      className="w-full h-full"
    >
      <ContextMenu.Root>
        <ContextMenu.Trigger asChild>
          <div className="w-full h-full">{children}</div>
        </ContextMenu.Trigger>
        <ContextMenu.Content className="z-50 min-w-[200px] bg-white border rounded shadow-md p-2 space-y-2">
          {!creatingType ? (
            <>
              <ContextMenu.Item
                className="cursor-pointer px-2 py-1 rounded hover:bg-gray-100"
                onSelect={(e) => {
                  e.preventDefault();
                  setCreatingType("note");
                }}
              >
                📄 New Note
              </ContextMenu.Item>
              <ContextMenu.Item
                className="cursor-pointer px-2 py-1 rounded hover:bg-gray-100"
                onSelect={(e) => {
                  e.preventDefault();
                  setCreatingType("folder");
                }}
              >
                📁 New Folder
              </ContextMenu.Item>
            </>
          ) : (
            <>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={`Enter ${creatingType} name`}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreate();
                  if (e.key === "Escape") setCreatingType(null);
                }}
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCreatingType(null)}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={handleCreate}>
                  Create
                </Button>
              </div>
            </>
          )}
        </ContextMenu.Content>
      </ContextMenu.Root>
    </div>
  );
};
