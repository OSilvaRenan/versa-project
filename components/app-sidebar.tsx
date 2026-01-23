 "use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

export const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Vitrola",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Edusp",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "VivaLivro",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Cadastro",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
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
          title: "Consulta Preço",
          url: "/paginas/consultapreco",
        },
        {
          title: "Editora",
          url: "/paginas/editora",
        },
        // {
        //   title: "Cadastro Direito Autoral",
        //   url: "/paginas/cadastros",
        // },
        // {
        //   title: "Cadastro Direito Autoral p",
        //   url: "/paginas/cadastros/direitoautoral",
        // },
       
      ],
    },
    // {
    //   title: "Lista",
    //   url: "#",
    //   icon: Bot,
    //   items: [
    //     {
    //       title: "Lista Editoras",
    //       url: "/paginas/lista",
    //     },
    //     {
    //       title: "Lista Autores",
    //       url: "/paginas/lista/listapaginada",
    //     },
    //     {
    //       title: "Lista Direito Autoral",
    //       url: "/paginas/lista/direitoautoral",
    //     },
    //   ],
    // },
    // {
    //   title: "lstCadastros",
    //   url: "#",
    //   icon: Bot,
    //   items: [
       
    //     {
    //       title: "Lista Direito Autoral",
    //       url: "/paginas/lstcadastros",
    //     },
    //   ],
    // },
    // {
    //   title: "Documentation",
    //   url: "#",
    //   icon: BookOpen,
    //   items: [
    //     {
    //       title: "Introduction",
    //       url: "#",
    //     },
    //     {
    //       title: "Get Started",
    //       url: "#",
    //     },
    //     {
    //       title: "Tutorials",
    //       url: "#",
    //     },
    //     {
    //       title: "Changelog",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "General",
    //       url: "#",
    //     },
    //     {
    //       title: "Team",
    //       url: "#",
    //     },
    //     {
    //       title: "Billing",
    //       url: "#",
    //     },
    //     {
    //       title: "Limits",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
  // projects: [
  //   {
  //     name: "Design Engineering",
  //     url: "#",
  //     icon: Frame,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: PieChart,
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: Map,
  //   },
    
  // ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
