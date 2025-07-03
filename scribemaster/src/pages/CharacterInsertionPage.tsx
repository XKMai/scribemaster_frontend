import { CampaignExplorer2 } from "@/components/CampaignCreationComponents/CampaignExplorer2";
import CharacterInsertion from "@/components/Character/AssetCreation/CharacterInsertion";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/UtilityComponents/AppSidebar";

const CharacterInsertionPage = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <div className="h-screen">
        <CampaignExplorer2 />
      </div>
    </SidebarProvider>
  );
};

export default CharacterInsertionPage;
