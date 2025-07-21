import CampaignCreation from "@/components/CampaignCreationComponents/CampaignCreation";
import { AppSidebar } from "@/components/UtilityComponents/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const CampaignCreationPage = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <div className="flex items-center justify-center h-screen w-full bg-muted px-4">
        <CampaignCreation />
      </div>
    </SidebarProvider>
  );
};

export default CampaignCreationPage;
