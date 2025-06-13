import { useState } from "react";
import { Button } from "../ui/button";
import type { Item } from "../../services/apiservice";
import { apiService } from "../../services/apiservice";
import { Input } from "../ui/input";
import { ContextMenu } from "radix-ui";

interface NoteContextMenuProps {
  note: Item;
  onItemUpdated: (updatedNote: Item) => void;
  onItemDeleted: (deletedNote: Item) => void;
  children: React.ReactNode;
}

const NoteContextMenu = ({ note, onItemUpdated, onItemDeleted, children }: NoteContextMenuProps) => {
  
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(note.data.title || "");

  const renameNote = async () => {
    if (!renameValue.trim()) return;
    try {
      const updatedNote = await apiService.updateNote(note.refId, { title: renameValue });
      note.data.title = updatedNote.title;
      onItemUpdated(note);
      setRenaming(false);
    } catch (error) {
      console.error("Failed to rename note:", error);
      alert("Failed to rename note.");
    }
  };

  const deleteNote = async () => {
    const confirmed = window.confirm(`Are you sure you want to delete the note "${note.data.title}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      await apiService.deleteNote(note.refId);
      onItemDeleted(note);
    } catch (error) {
      console.error("Failed to delete note:", error);
      alert("Failed to delete note.");
    }
  };

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
      <ContextMenu.Content className="z-50 rounded bg-white shadow-md p-2 space-y-2 min-w-[200px]">
          {!renaming && (
            <>
              <ContextMenu.Item
              className="cursor-pointer px-2 py-1 text-sm hover:bg-muted"
                onSelect={(e) => {
                  e.preventDefault();
                  setRenaming(true);
                  setRenameValue(note.data.title);
                }}
              >
                ✏️ Rename Note
              </ContextMenu.Item>
              <ContextMenu.Item
                className="cursor-pointer px-2 py-1 text-sm text-red-600 hover:bg-red-100"
                onSelect={deleteNote}
              >
                🗑️ Delete Note
              </ContextMenu.Item>
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
      </ContextMenu.Content>
    </ContextMenu.Root>
  )
}

export default NoteContextMenu