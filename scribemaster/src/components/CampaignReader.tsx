import { useState } from 'react';
import axios from 'axios';
import { Label } from "@radix-ui/react-label";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Alert, AlertDescription } from "./ui/alert";
import { FileText } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel } from '@radix-ui/react-dropdown-menu';

const CampaignReader = () => {

    // storing list of campaigns when obtained
    const [campaigns, setCampaigns] = useState<{id: string; name: string}[]>([])

    // call to obtain list of campaigns
    const fetchCampaigns = async () => {
        try {
        const response = await axios.get('http://127.0.0.1:5000/campaignslist');
        setCampaigns(response.data); 
        } catch (error) {
        console.error('Failed to fetch campaigns:', error);
        }
    };

    return (
    <Card className='w-full max-w-md mx-auto'>
        <CardHeader>
            <CardTitle>
                <FileText className='w-4 h-4' />
                Campaign Reader
            </CardTitle>
        </CardHeader>
        <CardContent className='grid gap-4'>
            <DropdownMenu onOpenChange={(open) => open && fetchCampaigns()}>
                <DropdownMenuTrigger asChild>
                <Button variant="outline">
                Open Campaigns
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {campaigns.length > 0 ? (
                        campaigns.map((campaign) => (
                            <DropdownMenuLabel key={campaign.id}>
                                {campaign.name}
                            </DropdownMenuLabel>
                    ))
                    ) : (
                    <DropdownMenuLabel>No campaigns found</DropdownMenuLabel>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </CardContent>
        <CardFooter className='grid gap-6'>
            <Button variant="outline" className='w-full'>
                Load Campaign
            </Button>
        </CardFooter>
    </Card>

  )
}

export default CampaignReader