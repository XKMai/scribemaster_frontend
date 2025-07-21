import { useState } from "react";
import { Button } from "../../ui/button";
import type { Item } from "../../../services/apiservice";
import { apiService } from "../../../services/apiservice";
import { Input } from "../../ui/input";
import { ContextMenu } from "radix-ui";

interface FolderContextMenuProps {
  folder: Item;
  onItemAdded: (
    updatedFolder: Item,
    action: "added" | "deleted" | "renamed"
  ) => void;
  children: React.ReactNode;
}

const FolderContextMenu = ({
  folder,
  onItemAdded,
  children,
}: FolderContextMenuProps) => {
  const [creatingType, setCreatingType] = useState<"note" | "folder" | null>(
    null
  );
  const [newName, setNewName] = useState("");

  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(folder.data.name || "");

  const createItem = async () => {
    const userdata = await apiService.getCookie();
    const userId = userdata.user.id;

    if (!newName.trim()) return;

    if (creatingType === "note") {
      const newNote = await apiService.createNote({
        title: newName,
        content: "",
        createdBy: userId,
        folderId: folder.refId,
      });

      folder.data.items = folder.data.items || [];
      const newItem: Item = {
        folderId: newNote.id,
        type: "note",
        refId: folder.data.id,
        position: folder.data.items.length,
        data: newNote,
      };
      folder.data.items.push(newItem);

      onItemAdded(newItem, "added");
      console.log("note created");
    }

    if (creatingType === "folder") {
      const newFolder = await apiService.createFolder({
        name: newName,
        createdBy: userId,
        folderId: folder.refId,
      });

      folder.data.items = folder.data.items || [];
      folder.data.items = [
        ...(folder.data.items || []),
        {
          id: newFolder.id,
          type: "folder",
          refId: newFolder.id,
          position: folder.data.items?.length || 0,
          data: newFolder,
        },
      ];

      onItemAdded(folder, "added");
    }
    setNewName("");
    setCreatingType(null);
  };

  const renameFolder = async () => {
    if (!renameValue.trim()) return;
    try {
      const updatedFolder = await apiService.updateFolder(folder.refId, {
        name: renameValue,
      });
      folder.data.name = updatedFolder.name;
      onItemAdded(folder, "renamed");
      setRenaming(false);
    } catch (error) {
      console.error("Failed to rename folder:", error);
      alert("Failed to rename folder.");
    }
  };

  const deleteFolder = async () => {
    console.log("delete pressed");
    const confirmed = window.confirm(
      `Are you sure you want to delete the folder "${folder.data.name}"? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await apiService.deleteFolder(folder.refId);
      onItemAdded(folder, "deleted");
    } catch (err) {
      console.error("Failed to delete folder:", err);
      alert("Failed to delete folder.");
    }
  };

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>

      <ContextMenu.Content className="z-50 rounded bg-white shadow-md p-2 space-y-2 min-w-[200px]">
        {!creatingType && !renaming && (
          <>
            <ContextMenu.Item
              className="cursor-pointer px-2 py-1 text-sm hover:bg-muted"
              onSelect={(e) => {
                e.preventDefault();
                setCreatingType("note");
              }}
            >
              📄 New Note
            </ContextMenu.Item>
            <ContextMenu.Item
              className="cursor-pointer px-2 py-1 text-sm hover:bg-muted"
              onSelect={(e) => {
                e.preventDefault();
                setCreatingType("folder");
              }}
            >
              📁 New Folder
            </ContextMenu.Item>
            <ContextMenu.Item
              className="cursor-pointer px-2 py-1 text-sm hover:bg-muted"
              onSelect={(e) => {
                e.preventDefault();
                setRenaming(true);
              }}
            >
              ✏️ Rename
            </ContextMenu.Item>
            <ContextMenu.Item
              className="cursor-pointer px-2 py-1 text-sm text-red-600 hover:bg-red-100"
              onSelect={deleteFolder}
            >
              🗑️ Delete
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

        {renaming && (
          <div className="space-y-1">
            <Input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") renameFolder();
                if (e.key === "Escape") {
                  setRenaming(false);
                  setRenameValue(folder.data.name);
                }
              }}
              autoFocus
            />
            <div className="flex justify-end space-x-2 pt-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setRenaming(false)}
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

export default FolderContextMenu;
