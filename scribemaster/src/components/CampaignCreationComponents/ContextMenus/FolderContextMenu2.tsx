import { useState } from "react";
import { ContextMenu } from "radix-ui";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { apiService } from "@/services/apiservice";
import type { Item } from "@/types/TreeTypes";
import type { ItemInstance } from "@headless-tree/core";
import { Folder, NotepadText, PencilIcon, Trash } from "lucide-react";

interface FolderContextMenuProps {
  itemInstance: ItemInstance<Item>;
  children: React.ReactNode;
}

export const FolderContextMenu2 = ({
  itemInstance,
  children,
}: FolderContextMenuProps) => {
  const item = itemInstance.getItemData();
  const folder = item.type === "folder" ? item : null;
  const [creatingType, setCreatingType] = useState<"note" | "folder" | null>(
    null
  );
  const [newName, setNewName] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(folder?.data.name || "");

  if (!folder) return <>{children}</>;

  const createItem = async () => {
    const userData = await apiService.getCookie();
    const userId = userData.user.id;

    if (!newName.trim()) return;

    try {
      if (creatingType === "note") {
        await apiService.createNote({
          title: newName,
          content: "",
          createdBy: userId,
          folderId: folder.refId,
        });
      }
      if (creatingType === "folder") {
        await apiService.createFolder({
          name: newName,
          createdBy: userId,
          folderId: folder.refId,
        });
      }
      itemInstance.invalidateChildrenIds();
      setCreatingType(null);
      setNewName("");
    } catch (err) {
      alert("Failed to create item");
    }
  };

  const renameFolder = async () => {
    if (!renameValue.trim()) return;
    try {
      await apiService.updateFolder(folder.refId, { name: renameValue });
      itemInstance.invalidateItemData();
      setIsRenaming(false);
    } catch {
      alert("Failed to rename folder");
    }
  };

  const deleteFolder = async () => {
    const confirmed = window.confirm(
      `Delete folder "${folder.data.name}"? This cannot be undone.`
    );
    if (!confirmed) return;
    try {
      await apiService.deleteFolder(folder.refId);
      const parent = itemInstance.getParent();
      parent?.invalidateChildrenIds();
    } catch {
      alert("Failed to delete folder");
    }
  };

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
      <ContextMenu.Content className="z-50 rounded shadow-md p-2 space-y-2 min-w-[150px] bg-muted">
        {!creatingType && !isRenaming && (
          <>
            <ContextMenu.Item
              className="cursor-pointer px-2 py-1 text-sm hover:bg-muted"
              onSelect={(e) => {
                e.preventDefault(); // prevent default radix closing
                setTimeout(() => {
                  setCreatingType("note");
                }, 0);
              }}
            >
              <div className="flex items-center gap-2">
                <NotepadText className="size-4" />
                New Note
              </div>
            </ContextMenu.Item>
            <ContextMenu.Item
              className="cursor-pointer px-2 py-1 text-sm hover:bg-muted"
              onSelect={(e) => {
                e.preventDefault(); // prevent default radix closing
                setTimeout(() => {
                  setCreatingType("folder");
                }, 0);
              }}
            >
              <div className="flex items-center gap-2">
                <Folder className="size-4" />
                New Folder
              </div>
            </ContextMenu.Item>
            <ContextMenu.Item
              className="cursor-pointer px-2 py-1 text-sm hover:bg-muted"
              onSelect={(e) => {
                e.preventDefault(); // prevent default radix closing
                setTimeout(() => {
                  setIsRenaming(true);
                  setRenameValue(folder.data.name);
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
              onSelect={deleteFolder}
            >
              <div className="flex items-center gap-2">
                <Trash className="size-4" />
                Delete
              </div>
            </ContextMenu.Item>
          </>
        )}

        {creatingType && (
          <div className="space-y-1">
            <Input
              placeholder={`Enter ${creatingType} name`}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") createItem();
                if (e.key === "Escape") {
                  setCreatingType(null);
                  setNewName("");
                }
              }}
              autoFocus
            />
            <div className="flex justify-end space-x-2 pt-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCreatingType(null)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={createItem}>
                Create
              </Button>
            </div>
          </div>
        )}

        {isRenaming && (
          <div className="space-y-1">
            <Input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") renameFolder();
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
              <Button size="sm" onClick={renameFolder}>
                Rename
              </Button>
            </div>
          </div>
        )}
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
};
