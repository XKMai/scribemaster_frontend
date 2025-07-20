import CampaignCreation from "@/components/CampaignCreationComponents/CampaignCreation";
import CampaignList from "@/components/HomeComponents/CampaignList";
import { CharacterButton } from "@/components/HomeComponents/CharacterButton";
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
          <h1 className="text-3xl font-bold mb-4">Welcome to Scribe Master!</h1>
          <Card className="w-full h-1/2 p-4 overflow-hidden flex flex-col mb-4">
            <CampaignList />
          </Card>
          <div className="flex flex-1 w-full gap-2">
            <div className="w-full max-w-sm flex items-end">
              <CampaignCreation />
            </div>
            <div className="flex flex-col justify-end items-end gap-2 w-full">
              <CharacterButton
                label="Create Characters and Assets"
                to="/charactercreation"
              />
              <CharacterButton
                label="View Characters and Assets "
                to="/characterinsertion"
              />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
};

export default HomePage;
