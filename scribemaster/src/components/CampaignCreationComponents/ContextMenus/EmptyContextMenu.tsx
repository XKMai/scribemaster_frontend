import { useEffect, useRef, useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { apiService } from "@/services/apiservice";
import type { Item } from "@/services/apiservice";
import * as ContextMenu from "@radix-ui/react-context-menu";

interface EmptyContextMenuProps {
  createdBy: number;
  campaignId: number;
  onItemAdded: (item: Item) => void;
  children: React.ReactNode;
}

const EmptyContextMenu = ({
  createdBy,
  campaignId,
  onItemAdded,
  children,
}: EmptyContextMenuProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [creatingType, setCreatingType] = useState<"note" | "folder" | null>(
    null
  );
  const [newName, setNewName] = useState("");

  const handleContextMenu = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".tree-item")) return;

    e.preventDefault();
    setCreatingType(null);
    setNewName("");
  };

  useEffect(() => {
    const handleClick = () => window.addEventListener("click", handleClick);
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

    setNewName("");
    setCreatingType(null);
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
                  if (e.key === "Enter") createItem();
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
                <Button size="sm" onClick={createItem}>
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

export default EmptyContextMenu;
