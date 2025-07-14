import CampaignCreation from "@/components/CampaignCreationComponents/CampaignCreation";
import CampaignList from "@/components/HomeComponents/CampaignList";
import { AppSidebar } from "@/components/UtilityComponents/AppSidebar";
import { Card } from "@/components/ui/card";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const HomePage = () => {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
        <div className="flex flex-col h-screen w-full bg-muted p-6 overflow-hidden">
          {/* Header */}
          <h1 className="text-3xl font-bold mb-4">Welcome to Scribe Master!</h1>

          {/* Top: Campaign List (takes up half height) */}
          <Card className="w-full h-1/2 p-4 overflow-hidden flex flex-col mb-4">
            <CampaignList />
          </Card>

          {/* Bottom: Campaign Creation aligned bottom-left */}
          <div className="flex flex-1 items-end">
            <div className="w-full max-w-sm">
              <CampaignCreation />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
};

export default HomePage;
