import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import type { Item } from "../services/apiservice";
import { apiService } from "../services/apiservice";

interface FolderContextMenuProps {
  folder: Item;
  trigger: React.ReactNode;
  onItemAdded: (updatedFolder: Item) => void;
}

const FolderContextMenu = ({ folder, trigger, onItemAdded }: FolderContextMenuProps) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setPosition({ x: e.pageX, y: e.pageY });
        setMenuVisible(true);
    };

    useEffect(() => {
        const handleClick = () => setMenuVisible(false);
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, []);

    const handleNewNote = async () => {
    const newNote = await apiService.createNote({
        title: "New Note",
        content: "",
        createdBy: folder.data.createdBy,
        folderId: folder.data.id,
    });

    folder.data.items = folder.data.items || [];
    folder.data.items.push({
        id: newNote.id,
        type: "note",
        refId: folder.data.id,
        position: folder.data.items.length,
        data: newNote,
    });

    onItemAdded(folder);
    setMenuVisible(false);
    };

    const handleNewFolder = async () => {
    const newFolder = await apiService.createFolder({
        name: "New Folder",
        createdBy: folder.data.createdBy,
        folderId: folder.data.id,
    });

    folder.data.items = folder.data.items || [];
    folder.data.items.push({
        id: newFolder.id,
        type: "folder",
        refId: folder.data.id,
        position: folder.data.items.length,
        data: newFolder,
    });

    onItemAdded(folder);
    setMenuVisible(false);
    };

    return (
    <>
        <div onContextMenu={handleContextMenu}>
            {trigger}
        </div>

        {menuVisible && (
            <div
                className="absolute z-50 w-40 bg-white border rounded shadow-md"
                style={{ top: position.y, left: position.x }}

            >
                <Button
                variant="ghost"
                className="w-full justify-start text-left px-4 py-2"
                onClick={handleNewNote}

                >
                ➕ New Note
                </Button>
                <Button
                variant="ghost"
                className="w-full justify-start text-left px-4 py-2"
                onClick={handleNewFolder}
                >
                📁 New Folder
                </Button>
            </div>
        )}
    </>
    )
}

export default FolderContextMenu