import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { apiService } from "@/services/apiservice";
import type { Item } from "@/services/apiservice";

interface EmptyContextMenuProps {
  createdBy: number;
  campaignId: number;
  onItemAdded: (item: Item) => void;
  children: React.ReactNode;
}

const EmptyContextMenu = ({ createdBy, campaignId, onItemAdded, children }: EmptyContextMenuProps) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [creatingType, setCreatingType] = useState<"note" | "folder" | null>(null);
  const [newName, setNewName] = useState("");

  const handleContextMenu = (e: React.MouseEvent) => {

    const target = e.target as HTMLElement;
    if (target.closest('.tree-item')) return;

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
    if (!newName.trim()) return;

    let newItem: Item | null = null;

    if (creatingType === "note") {
      const note = await apiService.createNote({
        title: newName,
        content: "",
        createdBy: createdBy,
        folderId: campaignId,
      });
      newItem = {
        folderId: campaignId,
        type: "note",
        refId: note.id,
        position: 0,
        data: note,
      };
    }

    if (creatingType === "folder") {
      const folder = await apiService.createFolder({
        name: newName,
        createdBy: createdBy,
        folderId: campaignId,
      });
      newItem = {
        folderId: campaignId,
        type: "folder",
        refId: folder.id,
        position: 0,
        data: folder,
      };
    }

    if (newItem) {
      onItemAdded(newItem);
    }

    setMenuVisible(false);
    setNewName("");
    setCreatingType(null);
  };

  return (
    <div onContextMenu={handleContextMenu} className="w-full h-full">
      {children}
      {menuVisible && (
        <div
          className="absolute z-50 w-64 bg-white border rounded shadow-md p-2 space-y-2"
          style={{ top: position.y, left: position.x }}
          onClick={(e) => e.stopPropagation()}
        >
          {!creatingType ? (
            <>
              <Button variant="ghost" className="w-full justify-start text-left" onClick={() => setCreatingType("note")}>
                📄 New Note
              </Button>
              <Button variant="ghost" className="w-full justify-start text-left" onClick={() => setCreatingType("folder")}>
                📁 New Folder
              </Button>
            </>
          ) : (
            <>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={`Enter ${creatingType} name`}
                onKeyDown={(e) => {
                  if (e.key === "Enter") createItem();
                  if (e.key === "Escape") setCreatingType(null);
                }}
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <Button size="sm" variant="outline" onClick={() => setCreatingType(null)}>Cancel</Button>
                <Button size="sm" onClick={createItem}>Create</Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyContextMenu;