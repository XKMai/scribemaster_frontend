import {
  ChevronUp,
  Home,
  User2,
  VenetianMask,
  BookUser,
  Swords,
  Library,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import LogoutButton from "../LoginComponents/LogoutButton";
import { apiService } from "@/services/apiservice";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import InformationBrowser from "../InformationBrowsingComponents/InformationBrowser";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Character Creation",
    url: "/charactercreation",
    icon: VenetianMask,
  },
  {
    title: "Character Insertion",
    url: "/characterinsertion",
    icon: BookUser,
  },
  {
    title: "Combat Encounter",
    url: "/combatlobby",
    icon: Swords,
  },
  {
    title: "Information Browsing",
    url: "/information",
    icon: Library,
  },
];

export function AppSidebar() {
  const [userName, setUserName] = useState<number | null>(null);

  useEffect(() => {
    apiService.getCookie().then((res) => setUserName(res.user.name));
  }, []);

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row justify-between">
        <SidebarGroupLabel>ScribeMaster</SidebarGroupLabel>
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="ghost">
              <Library />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="max-w-none w-[95vw] sm:w-[80vw] md:w-[70vw] lg:!w-[50vw] xl:!w-[50vw]"
          >
            <InformationBrowser />
          </SheetContent>
        </Sheet>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 />
                  {userName}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>
                    <LogoutButton />
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm">
                  <a href="/user">User Settings</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
