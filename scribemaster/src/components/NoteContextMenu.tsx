import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import type { Item } from "../services/apiservice";
import { apiService } from "../services/apiservice";
import { Input } from "./ui/input";

interface NoteContextMenuProps {
  note: Item;
  trigger: React.ReactNode;
  onItemUpdated: (updatedNote: Item) => void;
  onItemDeleted: (deletedNote: Item) => void;
}

const NoteContextMenu = ({ note, trigger, onItemUpdated, onItemDeleted }: NoteContextMenuProps) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(note.data.title || "");

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.pageX, y: e.pageY });
    setMenuVisible(true);
    setRenaming(false);
    setRenameValue(note.data.title);
  };

  useEffect(() => {
    const handleClick = () => setMenuVisible(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const renameNote = async () => {
    if (!renameValue.trim()) return;
    try {
      const updatedNote = await apiService.updateNote(note.data.id, { title: renameValue });
      note.data.title = updatedNote.title;
      onItemUpdated(note);
      setRenaming(false);
      setMenuVisible(false);
    } catch (error) {
      console.error("Failed to rename note:", error);
      alert("Failed to rename note.");
    }
  };

  const deleteNote = async () => {
    const confirmed = window.confirm(`Are you sure you want to delete the note "${note.data.title}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      await apiService.deleteNote(note.data.id);
      onItemDeleted(note);
      setMenuVisible(false);
    } catch (error) {
      console.error("Failed to delete note:", error);
      alert("Failed to delete note.");
    }
  };

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
          {!renaming && (
            <>
              <Button
                variant="ghost"
                className="w-full justify-start text-left px-2 py-1 text-sm"
                onClick={() => {
                  setRenaming(true);
                  setRenameValue(note.data.title);
                }}
              >
                ✏️ Rename Note
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-left px-2 py-1 text-sm text-red-600 hover:bg-red-100"
                onClick={deleteNote}
              >
                🗑️ Delete Note
              </Button>
            </>
          )}

          {renaming && (
            <div className="space-y-1">
              <Input
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") renameNote();
                  if (e.key === "Escape") {
                    setRenaming(false);
                    setRenameValue(note.data.title);
                  }
                }}
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <Button size="sm" variant="outline" onClick={() => setRenaming(false)}>Cancel</Button>
                <Button size="sm" onClick={renameNote}>Rename</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default NoteContextMenu