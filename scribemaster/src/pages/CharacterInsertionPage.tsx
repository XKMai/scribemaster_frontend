import CharacterInsertion from "@/components/Character/AssetCreation/CharacterInsertion";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/UtilityComponents/AppSidebar";

const CharacterInsertionPage = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <CharacterInsertion />
    </SidebarProvider>
  );
};

export default CharacterInsertionPage;
