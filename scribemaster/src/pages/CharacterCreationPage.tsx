import CharacterCreationForm from "@/components/Character/AssetCreation/CharacterCreationForm";
import PlayerCharacterCreationForm from "@/components/Character/AssetCreation/PlayerCharacterCreationForm";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/UtilityComponents/AppSidebar";

const CharacterCreationPage = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <PlayerCharacterCreationForm />
    </SidebarProvider>
  );
};

export default CharacterCreationPage;
