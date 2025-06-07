import { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { FileText } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import CampaignExplorer from './CampaignExplorer';
import { apiService } from '@/services/apiservice';


const CampaignReader = () => {

    // storing list of campaigns when obtained
    const [campaigns, setCampaigns] = useState<{id: string; name: string}[]>([])

    // storing selected campaign choice from list
    const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

    const [loadedCampaignId, setLoadedCampaignId] = useState<string | null>(null);
    
    // call to obtain list of campaigns
    const fetchCampaigns = async () => {
        try {
        const userdata = await apiService.getCookie()
        const userId: number = userdata.id
        const campaigndata = await apiService.getCampaignList(userId);
        setCampaigns(campaigndata);

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
      alert("Campaign loaded successfully!");
      setLoadedCampaignId(selectedCampaignId);
    } catch (error) {
      console.error("Failed to load campaign:", error);
      alert("Error loading campaign.");
    }
  };

    if (loadedCampaignId) {
      return <CampaignExplorer campaignId={loadedCampaignId} />;
    }
    
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