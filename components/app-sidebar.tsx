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
} from "lucide-react"
import Link from "next/link"

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
                <SidebarMenuButton tooltip={item.title}>
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
                        <Link href={subItem.url}>
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
      url: "/dashboard/patients",
      icon: Users,
      isActive: true,
      items: [
        {
          title: "Lister",
          url: "/dashboard/patients",
          icon: List,
        },
        {
          title: "Ajouter",
          url: "/dashboard/patients/add",
          icon: Plus,
        },
        {
          title: "Importer",
          url: "/dashboard/patients/import",
          icon: Import,
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
                <SidebarMenuButton>
                  Espace de travail
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