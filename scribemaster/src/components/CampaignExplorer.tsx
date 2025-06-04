import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import axios from "axios";
import { Button } from "./ui/button";
import samplecampaign from 'C:/Users/theay/Desktop/ScribeMaster_Frontend/scribemaster/src/assets/samplecampaign.json'

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

const CampaignExplorer = ({ campaignId }: CampaignViewerProps) => {
    const [items, setItems] = useState<Item[]>([]);
    const [selectedNote, setSelectedNote] = useState<Item | null>(null);
    const [currentFolderId, setCurrentFolderId] = useState<number | null>(null); // for future folder navigation


    useEffect(() => {
    const loadDummyCampaign = async () => {
        // Simulate "fetch"
        const data = samplecampaign; // already imported above
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
    return (
    <div className="flex h-full w-full">

        {/* file explorer*/}
        <div className="w-1/3 border-r p-4 bg-muted">
            <h2 className="font-bold mb-4">Files</h2>
            <ul className="space-y-2">
            {items.map((item) => {
            const isNote = item.type === "note";
            const label = isNote ? item.data.title : `📁 ${item.data.name}`;
            return (
              <li key={item.id}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left"
                  onClick={() =>
                    isNote
                      ? setSelectedNote(item)
                      : alert("Folder navigation not implemented in dummy mode") //openFolder(item.refId)
                  }
                >
                  {label}
                </Button>
              </li>
            );
          })}
            </ul>
        </div>

        {/* content viewer*/}
        <div className="w-2/3 p-4 h-full">
            <Card className="h-full">
            <CardHeader>
                <CardTitle>
                    {selectedNote ? selectedNote.data.title : "Select a note to view"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
                    {selectedNote?.data.content || ""}
                </pre>
            </CardContent>
            </Card>
        </div>
    </div>
  )
}

export default CampaignExplorer