"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  ChevronDown,
  ChevronRight,
  Plus,
  List,
  Import,
  Users,
  Calendar,
  FileText,
  Settings,
  Building,
  Heart,
  Stethoscope,
  UserCheck,
  Activity, // Added
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ElementType
    isActive?: boolean
    items?: {
      title: string
      url: string
      icon?: React.ElementType
    }[]
  }[]
}) {
  const pathname = usePathname();
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton 
                  tooltip={item.title}
                  className={pathname.startsWith(item.url) ? "bg-green-50 text-green-700 hover:bg-green-100" : "hover:bg-gray-100"}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link 
                          href={subItem.url}
                          className={pathname === subItem.url ? "bg-green-100 text-green-700 hover:bg-green-200" : "hover:bg-gray-50"}
                        >
                          {subItem.icon && <subItem.icon />}
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export function AppSidebar() {
  const navItems = [
    {
      title: "Patients",
      url: "/patients",
      icon: Heart,
      isActive: true,
      items: [
        {
          title: "Lister",
          url: "/patients",
          icon: List,
        },
        {
          title: "Importer",
          url: "/patients/import",
          icon: Import,
        },
      ],
    },
    {
      title: "Établissements de santé",
      url: "/health-facilities",
      icon: Building,
      items: [
        {
          title: "Lister",
          url: "/health-facilities",
          icon: List,
        },
        {
          title: "Ajouter",
          url: "/health-facilities/add",
          icon: Plus,
        },
      ],
    },
    {
      title: "Utilisateurs",
      url: "/users",
      icon: Users,
      items: [
        {
          title: "Lister",
          url: "/users",
          icon: List,
        },
        {
          title: "Ajouter",
          url: "/users/add",
          icon: Plus,
        },
      ],
    },
    {
      title: "Personnel",
      url: "/hospital-staff",
      icon: UserCheck,
      items: [
        {
          title: "Lister",
          url: "/hospital-staff",
          icon: List,
        },
        {
          title: "Ajouter",
          url: "/hospital-staff/add",
          icon: Plus,
        },
      ],
    },
    {
      title: "Consultations",
      url: "/consultations",
      icon: Activity,
      items: [
        {
          title: "Lister",
          url: "/consultations",
          icon: List,
        },
        {
          title: "Ajouter",
          url: "/consultations/add",
          icon: Plus,
        },
      ],
    },
    {
      title: "Rendez-vous",
      url: "/dashboard/appointments",
      icon: Calendar,
      items: [
        {
          title: "Lister",
          url: "/dashboard/appointments",
          icon: List,
        },
        {
          title: "Ajouter",
          url: "/dashboard/appointments/add",
          icon: Plus,
        },
      ],
    },
    {
      title: "Documents",
      url: "/dashboard/documents",
      icon: FileText,
      items: [
        {
          title: "Lister",
          url: "/dashboard/documents",
          icon: List,
        },
        {
          title: "Ajouter",
          url: "/dashboard/documents/add",
          icon: Plus,
        },
        {
          title: "Importer",
          url: "/dashboard/documents/import",
          icon: Import,
        },
      ],
    },
    {
      title: "Paramètres",
      url: "/dashboard/settings",
      icon: Settings,
      items: [
        {
          title: "Profil",
          url: "/dashboard/settings/profile",
          icon: Users,
        },
      ],
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="bg-gradient-to-r from-green-500 to-teal-600 text-white hover:from-green-600 hover:to-teal-700">
                  <Stethoscope className="h-4 w-4 mr-2" />
                  Espace de santé
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <span>Cabinet Médical</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}