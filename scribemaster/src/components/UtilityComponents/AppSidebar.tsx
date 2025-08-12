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
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import InformationBrowser from "../InformationBrowsingComponents/InformationBrowser";
import { Link, useNavigate } from "react-router";
import { useUserStore } from "@/stores/userStore";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { ModeToggle } from "./ModeToggle";

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
  const navigate = useNavigate();
  const userName = useUserStore((state) => state.user?.name);

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row justify-between">
        <SidebarGroupLabel className="text-accent-foreground text-sm">
          Scribe Master
        </SidebarGroupLabel>
        <div className="flew flex-row">
          <ModeToggle />
          <Sheet>
            <HoverCard>
              <HoverCardTrigger>
                <SheetTrigger asChild>
                  <Button size="icon" variant="outline">
                    <Library />
                  </Button>
                </SheetTrigger>
              </HoverCardTrigger>
              <HoverCardContent className="text-xs w-fit" side="right">
                Toggle Information Browser
              </HoverCardContent>
            </HoverCard>
            <SheetContent
              side="right"
              className="max-w-none w-[95vw] sm:w-[80vw] md:w-[70vw] lg:!w-[50vw] xl:!w-[50vw]"
            >
              <InformationBrowser />
            </SheetContent>
          </Sheet>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
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
                <SidebarMenuButton className="border-2 border-accent-foreground">
                  <User2 />
                  {userName}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-(--radix-dropdown-menu-trigger-width)"
                align="start"
              >
                <DropdownMenuItem>
                  <LogoutButton />
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    className="text-sm w-full"
                    onClick={() => navigate("/user")}
                    variant="ghost"
                  >
                    User Profile
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
