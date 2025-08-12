import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/UtilityComponents/AppSidebar";
import { apiService } from "@/services/apiservice";
import { useUserStore } from "@/stores/userStore";
import { User } from "lucide-react";
import { useState } from "react";

const UserProfilePage = () => {
  const user = useUserStore((state) => state.user);
  const initialiseUser = useUserStore((state) => state.initialiseUser);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const updateUserInStore = useUserStore((state) => state.setUser);

  const handleSave = async () => {
    if (!user) return;

    try {
      const updated = await apiService.updateUser(user.id, { name, email });
      updateUserInStore(updated.user);
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <div className="h-screen w-full">
        <div className="flex flex-col p-3">
          <div className="flex items-center gap-3 mb-8">
            <User className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">User Profile</h1>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Profile Information
                </CardTitle>
                <CardDescription>
                  View and manage your account details
                </CardDescription>
                <CardContent>
                  <div className="space-y-2 mt-3">
                    <Label htmlFor="username">Username</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="username"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 mt-3">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button onClick={handleSave}>Save Changes</Button>

                  <Button onClick={initialiseUser}>Refresh User</Button>
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default UserProfilePage;
