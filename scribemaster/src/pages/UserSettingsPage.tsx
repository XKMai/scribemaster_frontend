import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/UtilityComponents/AppSidebar";
import { useUserStore } from "@/stores/userStore";

const UserSettingsPage = () => {
  const initialiseUser = useUserStore((state) => state.initialiseUser);
  const user = useUserStore((state) => state.user);
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <div>
        <button onClick={initialiseUser}>set user data</button>
        <h1>{user?.name ?? "wait a minute..."}</h1>
        <p>email</p>
        <p>password rest?</p>
        <p>campaigns joined (list)</p>
        <p>campaigns created (list) </p>
      </div>
    </SidebarProvider>
  );
};

export default UserSettingsPage;
