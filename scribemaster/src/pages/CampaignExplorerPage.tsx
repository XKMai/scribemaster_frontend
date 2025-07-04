import { AppSidebar } from "@/components/UtilityComponents/AppSidebar"
import CampaignExplorer from "@/components/CampaignCreationComponents/CampaignExplorer"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useParams } from "react-router"


const CampaignExplorerPage = () => {
    const {campaignId} = useParams<{campaignId: string}>();

if (!campaignId) return <div>No campaign ID provided</div>;

  return (
    <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
        <CampaignExplorer campaignId={parseInt(campaignId)}/>
    </SidebarProvider>
  )
}

export default CampaignExplorerPage