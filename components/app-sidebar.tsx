"use client";

import { ChevronRight, GalleryVerticalEnd, SquareTerminal } from "lucide-react";
import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

import { TeamSwitcher } from "@/components/team-switcher";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const checkIsActive = (itemUrl: string) => {
    const [itemPath, itemQuery] = itemUrl.split("?");

    if (itemPath !== pathname) return false;

    if (!itemQuery) {
      return !searchParams.has("entrada");
    }

    const itemParams = new URLSearchParams(itemQuery);

    for (const [key, value] of itemParams.entries()) {
      if (searchParams.get(key) !== value) {
        return false;
      }
    }

    return true;
  };

  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    team: {
      name: session?.user?.Nomempresa || "",
      logo: GalleryVerticalEnd,
      plan: "",
    },
    navMain: [
      {
        title: "Cadastro",
        url: "#",
        icon: SquareTerminal,
        items: [
          {
            title: "Autor",
            url: "/paginas/autor",
          },
          {
            title: "Conferência",
            url: "/paginas/conferencia",
          },
          {
            title: "Conferência Entrada",
            url: "/paginas/conferencia?entrada=1",
          },
          {
            title: "Consulta Preço",
            url: "/paginas/consultapreco",
          },
          {
            title: "Editora",
            url: "/paginas/editora",
          },
        ],
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher team={data.team} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => {
              const isAnyChildActive = item.items?.some((subItem) =>
                checkIsActive(subItem.url)
              );

              return (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={isAnyChildActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => {
                          const isActive = checkIsActive(subItem.url);

                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild isActive={isActive}>
                                <a href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
      <SidebarRail />
    </Sidebar>
  );
}