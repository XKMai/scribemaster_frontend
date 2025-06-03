import CampaignCreation from "@/components/CampaignCreation"
import { AppSidebar } from "@/components/AppSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"


const CampaignCreationPage = () => {
  return (
    <SidebarProvider>
                    <AppSidebar/>
                    <SidebarTrigger/>
                        <CampaignCreation />
    </SidebarProvider>
  )
}

export default CampaignCreationPage