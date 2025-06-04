import React, { useState } from 'react';
import { Label } from "@radix-ui/react-label";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Alert, AlertDescription } from "./ui/alert";
import { Upload, FileText, AlertCircle } from 'lucide-react';
import FileTreeReader from './FileTreeReader';

// Campaign types
interface FileNode {
  id: string;
  name: string;
  type: 'file';
  size?: number;
  extension?: string;
  content?: string;
  lastModified?: string;
}

interface FolderNode {
  id: string;
  name: string;
  type: 'folder';
  children: (FileNode | FolderNode)[];
  isExpanded?: boolean;
}

interface NotesData {
  title: string;
  rootFolder: FolderNode;
}

interface Campaign {
  type: 'notes';
  data: NotesData;
}

const CampaignReader: React.FC = () => {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [campaignName, setCampaignName] = useState('');

  // Sample campaign data for demo purposes
  const sampleCampaign: Campaign = {
    type: "notes",
    data: {
      title: "Demo Campaign Files",
      rootFolder: {
        id: "root",
        name: "Campaign Root",
        type: "folder",
        children: [
          {
            id: "characters",
            name: "Characters",
            type: "folder",
            children: [
              {
                id: "char1",
                name: "player-characters.md",
                type: "file",
                size: 2048,
                extension: "md",
                lastModified: "2024-01-15"
              },
              {
                id: "char2",
                name: "npcs.txt",
                type: "file",
                size: 1536,
                extension: "txt",
                lastModified: "2024-01-10"
              }
            ]
          },
          {
            id: "sessions",
            name: "Session Notes",
            type: "folder",
            children: [
              {
                id: "sess1",
                name: "session-01.md",
                type: "file",
                size: 3072,
                extension: "md",
                lastModified: "2024-01-20"
              },
              {
                id: "sess2",
                name: "session-02.md",
                type: "file",
                size: 2560,
                extension: "md",
                lastModified: "2024-01-25"
              }
            ]
          },
          {
            id: "readme",
            name: "README.md",
            type: "file",
            size: 512,
            extension: "md",
            lastModified: "2024-01-01"
          }
        ]
      }
    }
  };

  const handleLoadDemo = () => {
    setIsLoading(true);
    setError('');
    
    // Simulate loading delay
    setTimeout(() => {
      setCampaign(sampleCampaign);
      setIsLoading(false);
    }, 1000);
  };

  const handleLoadCampaign = () => {
    if (!campaignName.trim()) {
      setError('Please enter a campaign name');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate loading a campaign
    setTimeout(() => {
      // In a real app, you'd fetch the campaign data from an API or file
      const customCampaign: Campaign = {
        type: "notes",
        data: {
          title: campaignName,
          rootFolder: {
            id: "root",
            name: campaignName + " Files",
            type: "folder",
            children: [
              {
                id: "empty",
                name: "getting-started.md",
                type: "file",
                size: 256,
                extension: "md",
                lastModified: new Date().toISOString().split('T')[0]
              }
            ]
          }
        }
      };
      
      setCampaign(customCampaign);
      setIsLoading(false);
    }, 1500);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json') {
      setError('Please upload a JSON file');
      return;
    }

    setIsLoading(true);
    setError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedCampaign = JSON.parse(content) as Campaign;
        
        // Basic validation
        if (parsedCampaign.type === 'notes' && parsedCampaign.data) {
          setCampaign(parsedCampaign);
        } else {
          setError('Invalid campaign file format');
        }
      } catch (err) {
        setError('Failed to parse campaign file');
      } finally {
        setIsLoading(false);
      }
    };
    
    reader.readAsText(file);
  };

  const handleReset = () => {
    setCampaign(null);
    setCampaignName('');
    setError('');
  };

  // If campaign is loaded, show the file tree
  if (campaign) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Campaign Loaded</h2>
          <Button variant="outline" onClick={handleReset}>
            Load Different Campaign
          </Button>
        </div>
        <FileTreeReader campaign={campaign} />
      </div>
    );
  }

  // Show campaign loading interface
  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <FileText className="w-6 h-6" />
          Campaign Reader
        </CardTitle>
        <CardDescription>
          Load your campaign files to explore the file structure.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid gap-2">
          <Label htmlFor="campaignName">Campaign Name</Label>
          <Input 
            id="campaignName" 
            type="text" 
            placeholder="Enter campaign name" 
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="fileUpload">Upload Campaign File</Label>
          <Input 
            id="fileUpload" 
            type="file" 
            accept=".json"
            onChange={handleFileUpload}
            disabled={isLoading}
            className="cursor-pointer"
          />
        </div>
      </CardContent>
      <CardFooter className="grid gap-2">
        <Button 
          className="w-full" 
          onClick={handleLoadCampaign}
          disabled={isLoading || !campaignName.trim()}
        >
          {isLoading ? 'Loading...' : 'Create New Campaign'}
        </Button>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleLoadDemo}
          disabled={isLoading}
        >
          <Upload className="w-4 h-4 mr-2" />
          {isLoading ? 'Loading...' : 'Load Demo Campaign'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CampaignReader;