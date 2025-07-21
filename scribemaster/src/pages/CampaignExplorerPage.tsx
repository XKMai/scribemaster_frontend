import { AppSidebar } from "@/components/UtilityComponents/AppSidebar";
import CampaignExplorer from "@/components/CampaignCreationComponents/CampaignExplorerComponents/CampaignExplorer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useParams } from "react-router";
import { CampaignExplorer2 } from "@/components/CampaignCreationComponents/CampaignExplorerComponents/CampaignExplorer2";

const CampaignExplorerPage = () => {
  const { campaignId } = useParams<{ campaignId: string }>();

  if (!campaignId) return <div>No campaign ID provided</div>;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <CampaignExplorer2 campaignId={parseInt(campaignId)} />
    </SidebarProvider>
  );
};

export default CampaignExplorerPage;
