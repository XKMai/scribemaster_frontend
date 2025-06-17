import CharacterCreationForm from "@/components/Character/AssetCreation/CharacterCreationForm";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/UtilityComponents/AppSidebar";

const CharacterCreationPage = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <CharacterCreationForm />
    </SidebarProvider>
  );
};

export default CharacterCreationPage;
