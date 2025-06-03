import { AppSidebar } from "@/components/AppSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

const HomePage = () => {
  return (
    <>
      <SidebarProvider>
        <AppSidebar/>
        <SidebarTrigger/>
        <div>Welcome to The Home Page!</div>
      </SidebarProvider>
    </>
  )
}

export default HomePage