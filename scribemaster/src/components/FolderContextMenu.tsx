import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import type { Item } from "../services/apiservice";
import { apiService } from "../services/apiservice";
import { Input } from "./ui/input";

interface FolderContextMenuProps {
  folder: Item;
  trigger: React.ReactNode;
  onItemAdded: (updatedFolder: Item, action: "added" | "deleted" | "renamed") => void;
}

const FolderContextMenu = ({ folder, trigger, onItemAdded }: FolderContextMenuProps) => {

    const [menuVisible, setMenuVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const [creatingType, setCreatingType] = useState<"note" | "folder" | null>(null);
    const [newName, setNewName] = useState("");

    const [renaming, setRenaming] = useState(false);
    const [renameValue, setRenameValue] = useState(folder.data.name || "");

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setPosition({ x: e.pageX, y: e.pageY });
        setMenuVisible(true);
        setCreatingType(null);
        setNewName("");
    };

    useEffect(() => {
        const handleClick = () => setMenuVisible(false);
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, []);

    const createItem = async () => {
      const userdata = await apiService.getCookie();
      const userId = userdata.user.id;

      if (!newName.trim()) return;

      if (creatingType === "note") {
          const newNote = await apiService.createNote({
          title: newName,
          content: "",
          createdBy: userId,
          folderId: folder.id,
          });
          
          folder.data.items = folder.data.items || [];
          folder.data.items.push({
          id: newNote.id,
          type: "note",
          refId: folder.data.id,
          position: folder.data.items.length,
          data: newNote,
          });

          console.log("note created")
      }

      if (creatingType === "folder") {
          const newFolder = await apiService.createFolder({
          name: newName,
          createdBy: userId,
          folderId: folder.id,
          });

          folder.data.items = folder.data.items || [];
          folder.data.items = [...(folder.data.items || []), {
          id: newFolder.id,
          type: "folder",
          refId: newFolder.id,
          position: folder.data.items?.length || 0,
          data: newFolder,
        }];

      }

      onItemAdded(folder, "added");
      setMenuVisible(false);
      setNewName("");
      setCreatingType(null);
    };

    const renameFolder = async () => {
        if (!renameValue.trim()) return;
        try {
            const updatedFolder = await apiService.updateFolder(folder.refId, { name: renameValue });
            folder.data.name = updatedFolder.name;
            onItemAdded(folder, "renamed"); 
            setRenaming(false);
            setMenuVisible(false);
        } catch (error) {
            console.error("Failed to rename folder:", error);
            alert("Failed to rename folder.");
        }
    };

    const deleteFolder = async () => {
      const confirmed = window.confirm(`Are you sure you want to delete the folder "${folder.data.name}"? This cannot be undone.`);
      if (!confirmed) return;

      try {
      await apiService.deleteFolder(folder.refId);
      // onItemAdded(folder, "deleted");
      setMenuVisible(false);
      } catch (err) {
      console.error("Failed to delete folder:", err);
      alert("Failed to delete folder.");
      }
    }

    


    return (
    <>
      <div onContextMenu={handleContextMenu}>
        {trigger}
      </div>

      {menuVisible && (
        <div
          className="absolute z-50 w-64 bg-white border rounded shadow-md p-2 space-y-2"
          style={{ top: position.y, left: position.x }}
          onClick={(e) => e.stopPropagation()}
        >
          {!creatingType && (
            <>
              <Button
                variant="ghost"
                className="w-full justify-start text-left px-2 py-1 text-sm"
                onClick={() => setCreatingType("note")}
              >
                📄 New Note
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-left px-2 py-1 text-sm"
                onClick={() => setCreatingType("folder")}
              >
                📁 New Folder
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-left px-2 py-1 text-sm text-red-600 hover:bg-red-100"
                onClick={async () => deleteFolder}
                >
                🗑️ Delete Folder
                </Button>
                <Button
                    variant="ghost"
                    className="w-full justify-start text-left px-2 py-1 text-sm"
                    onClick={() => {
                        setRenaming(true);
                        setRenameValue(folder.data.name);
                    }}
                >
                ✏️ Rename Folder
                </Button>
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
              <div className="flex justify-end space-x-2">
                <Button size="sm" variant="outline" onClick={() => setCreatingType(null)}>
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
                <div className="flex justify-end space-x-2">
                <Button size="sm" variant="outline" onClick={() => setRenaming(false)}>Cancel</Button>
                <Button size="sm" onClick={renameFolder}>Rename</Button>
                </div>
            </div>
            )}

        </div>
      )}
    </>
  );
}

export default FolderContextMenu