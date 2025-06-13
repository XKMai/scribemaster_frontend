import { useState } from 'react';
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { FileText } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { apiService } from '@/services/apiservice';
import { useNavigate } from 'react-router';


const CampaignReader = () => {

    // storing list of campaigns when obtained
    const [campaigns, setCampaigns] = useState<{id: number; name: string}[]>([])

    // storing selected campaign choice from list
    const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);
    const [campaignName, setCampaignName] = useState<string | null>(null);
    
    // call to obtain list of campaigns
    const fetchCampaigns = async () => {
        try {
        const userdata = await apiService.getCookie()
        const userId: number = userdata.user.id
        const campaigndata = await apiService.getCampaignList(userId);
        setCampaigns(campaigndata);

        } catch (error) {
        console.error('Failed to fetch campaigns:', error);
        }
    };

    const navigate = useNavigate();

    // function to get and load campaign folder
    const loadCampaign = async () => {
    if (!selectedCampaignId) {
      alert("Please select a campaign first.");
      return;
    }

    try {
      alert("Campaign loaded successfully!");
      // setLoadedCampaignId(selectedCampaignId);
      navigate(`/campaign/${selectedCampaignId}`)
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
                            onSelect={() => {
                                setSelectedCampaignId(campaign.id);
                                setCampaignName(campaign.name)
                            }}
                            className='border-muted-foreground p-1'
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
                Load {campaignName ? campaignName : "Campaign"}
            </Button>
        </CardFooter>
    </Card>

  )
}

export default CampaignReader