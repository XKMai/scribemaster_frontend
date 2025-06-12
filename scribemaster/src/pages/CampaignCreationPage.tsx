import CampaignCreation from "@/components/CampaignCreationComponents/CampaignCreation"
import { AppSidebar } from "@/components/UtilityComponents/AppSidebar"
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