import InformationBrowser from "@/components/InformationBrowsingComponents/InformationBrowser";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/UtilityComponents/AppSidebar";

export const InformationBrowsingPage = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <InformationBrowser />
    </SidebarProvider>
  );
};
