import CampaignCreation from "@/components/CampaignCreationComponents/CampaignCreation";
import CampaignList from "@/components/HomeComponents/CampaignList";
import { NavigationCard } from "@/components/HomeComponents/NavigationCard";
import { AppSidebar } from "@/components/UtilityComponents/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { BookUser, Library, Swords, VenetianMask } from "lucide-react";

const HomePage = () => {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
        <div className="flex flex-col h-screen w-full p-4 overflow-auto">
          <h2 className="text-3xl text-center font-bold mb-4">
            Welcome to Scribe Master!
          </h2>

          {/* Top Half */}
          <div className="w-full h-1/2 mb-4">
            <CampaignList />{" "}
          </div>

          {/* Bottom Half */}
          <div className="flex flex-1 w-full gap-4">
            {/* Bottom Left Half */}
            <div className="w-1/2 h-full">
              <CampaignCreation />
            </div>

            {/* Bottom Right Half */}
            <div className="w-1/2 h-full grid grid-cols-2 grid-rows-2 gap-2">
              <div className="bg-yellow-200">
                <NavigationCard
                  label="Create Characters/Assets"
                  to="/charactercreation"
                  description="Build characters, spells and items for your campaigns"
                  icon={VenetianMask}
                />
              </div>
              <div className="bg-purple-200">
                <NavigationCard
                  label="Insert Characters/Assets"
                  to="/characterinsertion"
                  description="Insert your creations into your campaigns"
                  icon={BookUser}
                />
              </div>
              <div className="bg-orange-200">
                <NavigationCard
                  label="Combat Room"
                  to="/combatlobby"
                  description="Let your characters battle! Invite the party!"
                  icon={Swords}
                />
              </div>
              <div className="bg-pink-200">
                <NavigationCard
                  label="Information Browsing"
                  to="/information"
                  description="Browse for detailed game information (toggle via sidebar)"
                  icon={Library}
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
};

export default HomePage;
