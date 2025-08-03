import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/UtilityComponents/AppSidebar";
import { useUserStore } from "@/stores/userStore";

const UserProfilePage = () => {
  const user = useUserStore((state) => state.user);
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <div className="h-screen w-full">
        <div className="flex flex-col p-3">
          <h1 className="text-2xl font-bold p-6 bg-secondary">User Profile</h1>
          <div className="flex flex-col p-3">
            <h1>Username: {user?.name ?? "wait a minute..."}</h1>
            <p>Email</p>
            <p>password reset?</p>
            <p>campaigns joined (list)</p>
            <p>campaigns created (list) </p>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default UserProfilePage;
