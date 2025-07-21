import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import FolderContextMenu from "../ContextMenus/FolderContextMenu";
import NoteContextMenu from "../ContextMenus/NoteContextMenu";
import {
  apiService,
  type FolderData,
  type Item,
  type NoteData,
} from "@/services/apiservice";
import EmptyContextMenu from "../ContextMenus/EmptyContextMenu";

interface CampaignViewerProps {
  campaignId: number;
}

// type guards
const isNote = (item: Item): item is Item & { data: NoteData } =>
  item.type === "note";
const isFolder = (item: Item): item is Item & { data: FolderData } =>
  item.type === "folder";

const CampaignExplorer = ({ campaignId }: CampaignViewerProps) => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedNote, setSelectedNote] = useState<Item | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(
    new Set()
  );
  const [editableTitle, setEditableTitle] = useState("");
  const [editableContent, setEditableContent] = useState("");

  useEffect(() => {
    if (selectedNote && isNote(selectedNote)) {
      setEditableTitle(selectedNote.data.title);
      setEditableContent(selectedNote.data.content);
    }
  }, [selectedNote]);

  // fetch full campaign folder
  useEffect(() => {
    const fetchCampaignRoot = async () => {
      try {
        const id = campaignId;
        const campaign = await apiService.getFolder(id);
        setItems(campaign.items);
      } catch (error) {
        console.error("Failed to fetch campaign data:", error);
      }
    };

    fetchCampaignRoot();
  }, [campaignId]);

  // fetch nested folder contents
  const loadFolderItems = async (folder: Item) => {
    const folderId = folder.refId;
    if (
      !isFolder(folder) ||
      folder.data.items ||
      folder.refId === Number(campaignId)
    )
      return;

    try {
      const response = await apiService.getFolder(folderId);
      folder.data.items = response.items;
    } catch (error) {
      console.error("Failed to load folder contents", error);
    }
  };

  const toggleFolder = async (folder: Item) => {
    const folderId = folder.refId;
    const newSet = new Set(expandedFolders);

    if (expandedFolders.has(folderId)) {
      newSet.delete(folderId);
    } else {
      await loadFolderItems(folder);
      newSet.add(folderId);
    }

    setExpandedFolders(newSet);
  };

  const updateNoteInTree = (tree: Item[], updatedNote: Item): Item[] => {
    return tree.map((item) => {
      if (isNote(item) && item.data.id === updatedNote.folderId) {
        return {
          ...item,
          data: { ...item.data, title: updatedNote.data.title },
        };
      }

      if (isFolder(item) && item.data.items) {
        return {
          ...item,
          data: {
            ...item.data,
            items: updateNoteInTree(item.data.items, updatedNote),
          },
        };
      }

      return item;
    });
  };

  const deleteNoteFromTree = (tree: Item[], noteId: number): Item[] => {
    return tree
      .map((item) => {
        if (isFolder(item) && item.data.items) {
          return {
            ...item,
            data: {
              ...item.data,
              items: deleteNoteFromTree(item.data.items, noteId),
            },
          };
        }
        return item;
      })
      .filter((item) => !(isNote(item) && item.data.id === noteId));
  };

  const handleSave = async () => {
    if (!selectedNote || !isNote(selectedNote)) return;

    try {
      const updated = await apiService.updateNote(selectedNote.data.id, {
        title: editableTitle,
        content: editableContent,
      });

      const updatedNote: Item = {
        ...selectedNote,
        data: { ...selectedNote.data, ...updated },
      };

      setSelectedNote(updatedNote);
      const updatedTree = updateNoteInTree(items, updatedNote);
      setItems(updatedTree);
    } catch (err) {
      console.error("Failed to update note:", err);
      alert("Failed to save changes.");
    }
  };

  const removeItemFromTree = (tree: Item[], idToRemove: number): Item[] => {
    return tree
      .filter((item) => item.data.id !== idToRemove)
      .map((item) => {
        if (isFolder(item) && item.data.items) {
          return {
            ...item,
            data: {
              ...item.data,
              items: removeItemFromTree(item.data.items, idToRemove),
            },
          };
        }
        return item;
      });
  };

  const handleItemChange = (
    updatedItem: Item,
    action: "added" | "deleted" | "renamed"
  ) => {
    if (action === "deleted") {
      const updatedTree = removeItemFromTree(items, updatedItem.data.id);
      setItems(updatedTree);
    } else {
      // for add or rename, reload the root folder to ensure the full tree updates
      apiService
        .getFolder(campaignId)
        .then((campaign) => setItems(campaign.items))
        .catch((err) => {
          console.error("Failed to reload campaign data after update:", err);
        });
    }
  };

  // recursive rendering function

  const renderItems = (items: Item[], level: number = 0) => {
    return items.map((item) => {
      const paddingLeft = `${level * 16}px`;

      return (
        <div
          key={item.refId}
          className={`tree-item space-y-1 ${level}-${
            item.folderId ?? "no-folder"
          }`}
        >
          {isFolder(item) ? (
            <FolderContextMenu folder={item} onItemAdded={handleItemChange}>
              <Button
                variant="ghost"
                className="w-full justify-start text-left"
                style={{ paddingLeft }}
                onClick={() => toggleFolder(item)}
              >
                {`${expandedFolders.has(item.data.id) ? "📂" : "📁"} ${
                  item.data.name
                }`}
              </Button>
            </FolderContextMenu>
          ) : (
            <NoteContextMenu
              note={item}
              onItemUpdated={(updatedNote) => {
                const updatedTree = updateNoteInTree(items, updatedNote);
                setItems(updatedTree);
              }}
              onItemDeleted={(deletedNote) => {
                const updatedTree = deleteNoteFromTree(
                  items,
                  deletedNote.data.id
                );
                setItems(updatedTree);
                if (selectedNote?.data.id === deletedNote.data.id) {
                  setSelectedNote(null);
                }
              }}
            >
              <Button
                variant="ghost"
                className="w-full justify-start text-left"
                style={{ paddingLeft }}
                onClick={() => setSelectedNote(item)}
              >
                {item.data.title}
              </Button>
            </NoteContextMenu>
          )}
          {isFolder(item) &&
            expandedFolders.has(item.data.id) &&
            item.data.items &&
            renderItems(item.data.items, level + 1)}
        </div>
      );
    });
  };

  return (
    <div className="flex h-screen w-full">
      {/* file explorer*/}
      <div className="w-1/3 border-r p-4 bg-muted h-full overflow-auto">
        <h2 className="font-bold mb-4">Files</h2>
        <EmptyContextMenu
          createdBy={items[0]?.data.createdBy || 1}
          onItemAdded={(newItem) => setItems((prev) => [...prev, newItem])}
          campaignId={campaignId}
        >
          <div className="min-h-full">
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center mt-4">
                Right-click to create your first folder or note
              </p>
            ) : (
              renderItems(items)
            )}
          </div>
        </EmptyContextMenu>
      </div>

      {/* content viewer*/}
      <div className="w-2/3 p-4 h-full overflow-auto">
        <Card className="h-full flex flex-col">
          <CardHeader>
            {selectedNote && isNote(selectedNote) ? (
              <Input
                className="font-bold text-lg"
                value={editableTitle}
                onChange={(e) => setEditableTitle(e.target.value)}
              />
            ) : (
              <CardTitle>Select a note to view</CardTitle>
            )}
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            {selectedNote && isNote(selectedNote) ? (
              <>
                <Textarea
                  className="flex-1 text-sm"
                  value={editableContent}
                  onChange={(e) => setEditableContent(e.target.value)}
                />
                <div className="flex justify-end mt-2">
                  <Button onClick={handleSave}>💾 Save</Button>
                </div>
              </>
            ) : (
              <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
                ....
              </pre>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CampaignExplorer;
