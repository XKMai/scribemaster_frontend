import { AppSidebar } from "@/components/UtilityComponents/AppSidebar"
import CampaignReader from "@/components/CampaignCreationComponents/CampaignReader"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"


const CampaignReaderPage = () => {
  return (
    <SidebarProvider>
        <AppSidebar/>
        <SidebarTrigger/>
        <CampaignReader />
    </SidebarProvider>
    
  )
}

export default CampaignReaderPage