import { AppSidebar } from "@/components/AppSidebar"
import CampaignReader from "@/components/CampaignReader"
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