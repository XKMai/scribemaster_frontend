import { useState } from 'react';
import axios from 'axios';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { FileText } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import CampaignExplorer from './CampaignExplorer';

const CampaignReader = () => {

    // storing list of campaigns when obtained
    const [campaigns, setCampaigns] = useState<{id: string; name: string}[]>([])

    // storing selected campaign choice from list
    const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
    
    // placeholder to store campaign data, to be passed to viewing component
    const [campaignData, setCampaignData] = useState<any>(null);

    // call to obtain list of campaigns
    const fetchCampaigns = async () => {
        try {
        //const response = await axios.get('http://127.0.0.1:5000/campaignslist');
        //setCampaigns(response.data); 
        const dummy = [
        { id: '1', name: 'Test Campaign 1' },
        { id: '2', name: 'Test Campaign 2' }
        ];
        console.log("Using mock data");
        setCampaigns(dummy);
        } catch (error) {
        console.error('Failed to fetch campaigns:', error);
        }
    };

    // function to get and load campaign folder
    const loadCampaign = async () => {
    if (!selectedCampaignId) {
      alert("Please select a campaign first.");
      return;
    }

    try {
      const response = await axios.get(`http://127.0.0.1:5000/campaigns/${selectedCampaignId}`);
      alert("Campaign loaded successfully!");
      return (
        <CampaignExplorer campaignId={selectedCampaignId} />
      )
    } catch (error) {
      console.error("Failed to load campaign:", error);
      alert("Error loading campaign.");
    }
  };

    return (
    <Card className='w-full max-w-md mx-auto my-auto flex flex-col h-[400px]'>
        <CardHeader>
            <CardTitle>
                <FileText className='w-4 h-4 inline-block mr-2' />
                Campaign Reader
            </CardTitle>
        </CardHeader>
        <CardContent className='grid gap-4 flex-grow'>
            <DropdownMenu onOpenChange={(open) => open && fetchCampaigns()}>
                <DropdownMenuTrigger asChild>
                <Button variant="outline">
                Open Campaigns
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {campaigns.length > 0 ? (
                        campaigns.map((campaign) => (
                            <DropdownMenuItem
                            key={campaign.id}
                            onSelect={() => setSelectedCampaignId(campaign.id)}
                            >
                                {campaign.name}
                            </DropdownMenuItem>
                    ))
                    ) : (
                    <DropdownMenuLabel>No campaigns found</DropdownMenuLabel>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </CardContent>
        <CardFooter className='p-4 border-t mt-auto'>
            <Button variant="outline" className='w-full' onClick={loadCampaign}>
                Load Campaign
            </Button>
        </CardFooter>
    </Card>

  )
}

export default CampaignReader