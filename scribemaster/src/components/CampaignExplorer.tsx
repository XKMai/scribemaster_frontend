import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import FolderContextMenu from "./FolderContextMenu";
import NoteContextMenu from "./NoteContextMenu";
import { apiService, type FolderData, type Item, type NoteData } from "@/services/apiservice";

interface CampaignViewerProps {
  campaignId: string;
}

// type guards
const isNote = (item: Item): item is Item & { data: NoteData } => item.type === "note";
const isFolder = (item: Item): item is Item & { data: FolderData } => item.type === "folder";



const CampaignExplorer = ({ campaignId }: CampaignViewerProps) => {
    const [items, setItems] = useState<Item[]>([]);
    const [selectedNote, setSelectedNote] = useState<Item | null>(null);
    const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set());
    const [editableTitle, setEditableTitle] = useState("");
    const [editableContent, setEditableContent] = useState("");
  
    /*
    useEffect(() => {
    const loadDummyCampaign = async () => {
        const data = samplecampaign; 
        setItems(data.items as Item[]);
    };
    

    loadDummyCampaign();
    }, [campaignId]);
    */

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
        const id = Number(campaignId);
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
        const folderId = folder.data.id;
        if (!isFolder(folder) || folder.data.items) return;

        try {
        const response = await apiService.getFolder(folderId);
        folder.data.items = response.items;

        } catch (error) {
        console.error("Failed to load folder contents", error);
        }
    };
    

    const toggleFolder = async (folder: Item) => {
        
        const folderId = folder.data.id;
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
            if (isNote(item) && item.id === updatedNote.id) {
            return { ...item, data: { ...item.data, title: updatedNote.data.title } };
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
            .filter((item) => !(isNote(item) && item.id === noteId));
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



    // recursive rendering function
    const renderItems = (items: Item[], level: number = 0) => {
        return items.map((item) => {
          const paddingLeft = `${level * 16}px`;
    
          return (
            <div key={item.id} className="space-y-1">
              {isFolder(item) ? (
                <FolderContextMenu
                    folder={item}
                    onItemAdded={() => setItems([...items])}
                    trigger={
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-left"
                        style={{ paddingLeft }}
                        onClick={() => toggleFolder(item)}
                    >
                        {`${expandedFolders.has(item.data.id) ? "📂" : "📁"} ${item.data.name}`}
                    </Button>
                    }
                />
                ) : (
                <NoteContextMenu
                    note={item}
                    onItemUpdated={(updatedNote) => {
                        const updatedTree = updateNoteInTree(items, updatedNote);
                        setItems(updatedTree);
                    }}
                    onItemDeleted={(deletedNote) => {
                        const updatedTree = deleteNoteFromTree(items, deletedNote.id);
                        setItems(updatedTree);
                        if (selectedNote?.id === deletedNote.id) {
                            setSelectedNote(null);
                        }
                    }}
                    trigger={
                        <Button
                        variant="ghost"
                        className="w-full justify-start text-left"
                        style={{ paddingLeft }}
                        onClick={() => setSelectedNote(item)}
                        >
                        {item.data.title}
                        </Button>
                    }
                />

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
            {renderItems(items)}
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
  )
}

export default CampaignExplorer