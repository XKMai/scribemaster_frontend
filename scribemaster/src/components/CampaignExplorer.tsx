import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import axios from "axios";
import { Button } from "./ui/button";
import samplecampaign from 'C:/Users/theay/Desktop/ScribeMaster_Frontend/scribemaster/src/assets/samplecampaign.json'

type NoteData = {
  id: number;
  title: string;
  content: string;
  createdBy: number;
};

type FolderData = {
  id: number;
  name: string;
  isCampaign: boolean;
  settings: object;
  createdBy: number;
  items?: Item[];
};

type Item = {
  id: number;
  type: "note" | "folder";
  refId: number;
  position: number;
  data: any; // contains `title` & `content` for notes, `name` for folders
};

interface CampaignViewerProps {
  campaignId: string;
}

// type guards
const isNote = (item: Item): item is Item & { data: NoteData } => item.type === "note";
const isFolder = (item: Item): item is Item & { data: FolderData } => item.type === "folder";



const CampaignExplorer = ({ campaignId }: CampaignViewerProps) => {
    const [items, setItems] = useState<Item[]>([]);
    const [selectedNote, setSelectedNote] = useState<Item | null>(null);
    const [currentFolderId, setCurrentFolderId] = useState<number | null>(null); // for future folder navigation

    
    // use dummy data for now
    useEffect(() => {
    const loadDummyCampaign = async () => {
        const data = samplecampaign; 
        setItems(data.items as Item[]);
    };

    loadDummyCampaign();
    }, [campaignId]);

    // fetch full campaign folder
    /*
    useEffect(() => {
    const fetchCampaignRoot = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/campaigns/${campaignId}`);
        setItems(response.data.items);
      } catch (error) {
        console.error("Failed to fetch campaign data:", error);
      }
    };

    fetchCampaignRoot();
    }, [campaignId]);

     // Future use: fetch nested folder contents
    const openFolder = async (folderId: number) => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/folders/${folderId}`);
            setItems(response.data.items);
            setSelectedNote(null);
            setCurrentFolderId(folderId);
        } catch (error) {
            console.error("Failed to load folder:", error);
        }
    };
    */

    const renderItems = (items: Item[], level: number = 0) => {
        return items.map((item) => {
          const paddingLeft = `${level * 16}px`;
    
          return (
            <div key={item.id} className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start text-left"
                style={{ paddingLeft }}
                onClick={() => {
                  if (isNote(item)) {
                    setSelectedNote(item);
                  }
                }}
              >
                {isFolder(item) ? `📁 ${item.data.name}` : isNote(item) ? item.data.title : ""}
              </Button>
    
              {isFolder(item) &&
                item.data.items &&
                renderItems(item.data.items, level + 1)}
            </div>
          );
        });
    };

    return (
    <div className="flex h-full w-full">

        {/* file explorer*/}
        <div className="w-1/3 border-r p-4 bg-muted">
            <h2 className="font-bold mb-4">Files</h2>
            {renderItems(items)}
        </div>

        {/* content viewer*/}
        <div className="w-2/3 p-4 h-full">
            <Card className="h-full">
            <CardHeader>
                <CardTitle>
                    {selectedNote && isNote(selectedNote)
                    ? selectedNote.data.title 
                    : "Select a note to view"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
                    {selectedNote && isNote(selectedNote)
                    ?selectedNote.data.content 
                    :"...."}
                </pre>
            </CardContent>
            </Card>
        </div>
    </div>
  )
}

export default CampaignExplorer