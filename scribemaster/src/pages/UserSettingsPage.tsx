import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/UtilityComponents/AppSidebar";

const UserSettingsPage = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <div>
        <h1>Username</h1>
        <p>email</p>
        <p>password rest?</p>
        <p>campaigns joined (list)</p>
        <p>campaigns created (list) </p>
      </div>
    </SidebarProvider>
  );
};

export default UserSettingsPage;
