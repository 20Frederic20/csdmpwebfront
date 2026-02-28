"use client"

import { useEffect, useState } from "react"

// Client-side wrapper for Collapsible to handle hydration
function ClientCollapsible({ children, defaultOpen, ...props }: React.ComponentProps<typeof Collapsible> & { defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  
  // Use useEffect to set initial state only on client side, preventing SSR mismatch
  useEffect(() => {
    setIsOpen(!!defaultOpen)
  }, [defaultOpen])
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} {...props}>
      {children}
    </Collapsible>
  )
}

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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  ChevronRight,
  Plus,
  Users,
  UserCog,
  UserPlus,
  Building2,
  BarChart3,
  FileText,
  Stethoscope,
  Activity,
  Beaker,
  Shield,
  Calendar,
  Link as LinkIcon,
  Building,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { usePermissions } from "@/hooks/use-permissions"

function NavMain({
  items,
  loading
}: {
  items: {
    title: string
    url?: string
    icon?: React.ComponentType<{ className?: string }>
    isActive?: boolean
    items?: {
      title: string
      url: string
      icon?: React.ComponentType<{ className?: string }>
      requiredPermission?: {
        resource: string
        action: string
      }
    }[]
    requiredPermission?: {
      resource: string
      action: string
    }
  }[]
  loading?: boolean
}) {
  const { canAccess } = usePermissions()
  const pathname = usePathname();
  
  // Afficher le menu même pendant le chargement, mais sans filtrer les permissions
  if (loading) {
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
                    {item.items && item.items.length > 0 && (
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    )}
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
    );
  }
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          // Filter menu items based on permissions
          if (item.requiredPermission && !canAccess(item.requiredPermission.resource, item.requiredPermission.action)) {
            return null;
          }
          
          // Filter sub-items based on permissions
          const filteredSubItems = item.items ? item.items.filter(subItem => {
            if (subItem.requiredPermission && !canAccess(subItem.requiredPermission.resource, subItem.requiredPermission.action)) {
              return false;
            }
            return true;
          }) : [];
          
          return (
            <ClientCollapsible
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
                    {filteredSubItems.length > 0 && (
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                {filteredSubItems.length > 0 && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {filteredSubItems.map((subItem) => (
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
                )}
              </SidebarMenuItem>
            </ClientCollapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  const pathname = usePathname()
  const { loading } = usePermissions()
  const { canAccess } = usePermissions()

  const menuItems = [
    {
      title: "Patients",
      url: "/patients",
      icon: Users,
      isActive: pathname.startsWith("/patients"),
      requiredPermission: {
        resource: "patients",
        action: "list"
      },
      items: [
        {
          title: "Liste des patients",
          url: "/patients",
          icon: Users,
          requiredPermission: {
            resource: "patients",
            action: "list"
          }
        },
        {
          title: "Ajouter un patient",
          url: "/patients/add",
          icon: UserPlus,
          requiredPermission: {
            resource: "patients",
            action: "create"
          }
        }
      ]
    },
    {
      title: "Personnel hospitalier",
      url: "/hospital-staff",
      icon: UserCog,
      isActive: pathname.startsWith("/hospital-staff"),
      requiredPermission: {
        resource: "hospital_staffs",
        action: "list"
      },
      items: [
        {
          title: "Liste du personnel",
          url: "/hospital-staff",
          icon: Users,
          requiredPermission: {
            resource: "hospital_staffs",
            action: "list"
          }
        },
        {
          title: "Ajouter un membre",
          url: "/hospital-staff/add",
          icon: UserPlus,
          requiredPermission: {
            resource: "hospital_staffs",
            action: "create"
          }
        }
      ]
    },
    {
      title: "Départements",
      url: "/departments",
      icon: Building,
      isActive: pathname.startsWith("/departments"),
      requiredPermission: {
        resource: "departments",
        action: "list"
      },
      items: [
        {
          title: "Liste des départements",
          url: "/departments",
          icon: Building,
          requiredPermission: {
            resource: "departments",
            action: "list"
          }
        },
        {
          title: "Ajouter un département",
          url: "/departments/add",
          icon: Plus,
          requiredPermission: {
            resource: "departments",
            action: "create"
          }
        }
      ]
    },
    {
      title: "Établissements",
      url: "/health-facilities",
      icon: Building2,
      isActive: pathname.startsWith("/health-facilities"),
      requiredPermission: {
        resource: "health_facilities",
        action: "list"
      },
      items: [
        {
          title: "Liste des établissements",
          url: "/health-facilities",
          icon: Building2,
          requiredPermission: {
            resource: "health_facilities",
            action: "list"
          }
        },
        {
          title: "Ajouter un établissement",
          url: "/health-facilities/add",
          icon: Plus,
          requiredPermission: {
            resource: "health_facilities",
            action: "create"
          }
        }
      ]
    },
    {
      title: "Assurances",
      url: "/insurance-companies",
      icon: Shield,
      isActive: pathname.startsWith("/insurance-companies"),
      requiredPermission: {
        resource: "insurance_companies",
        action: "list"
      },
      items: [
        {
          title: "Liste des assurances",
          url: "/insurance-companies",
          icon: Shield,
          requiredPermission: {
            resource: "insurance_companies",
            action: "list"
          }
        },
        {
          title: "Ajouter une assurance",
          url: "/insurance-companies/add",
          icon: Plus,
          requiredPermission: {
            resource: "insurance_companies",
            action: "create"
          }
        }
      ]
    },
    {
      title: "Assurances Patients",
      url: "/patient-insurance",
      icon: LinkIcon,
      isActive: pathname.startsWith("/patient-insurance"),
      requiredPermission: {
        resource: "patient_insurances",
        action: "list"
      },
      items: [
        {
          title: "Liste des assurances patients",
          url: "/patient-insurance",
          icon: LinkIcon,
          requiredPermission: {
            resource: "patient_insurances",
            action: "list"
          }
        },
        {
          title: "Ajouter une assurance patient",
          url: "/patient-insurance/add",
          icon: Plus,
          requiredPermission: {
            resource: "patient_insurances",
            action: "create"
          }
        }
      ]
    },
    {
      title: "Consultations",
      url: "/consultations",
      icon: Calendar,
      isActive: pathname.startsWith("/consultations"),
      requiredPermission: {
        resource: "consultations",
        action: "list"
      },
      items: [
        {
          title: "Liste des consultations",
          url: "/consultations",
          icon: Calendar,
          requiredPermission: {
            resource: "consultations",
            action: "list"
          }
        },
        {
          title: "Ajouter une consultation",
          url: "/consultations/add",
          icon: Plus,
          requiredPermission: {
            resource: "consultations",
            action: "create"
          }
        }
      ]
    },
    {
      title: "Rendez-vous",
      url: "/appointments",
      icon: Calendar,
      isActive: pathname.startsWith("/appointments"),
      requiredPermission: {
        resource: "appointments",
        action: "list"
      },
      items: [
        {
          title: "Liste des rendez-vous",
          url: "/appointments",
          icon: Calendar,
          requiredPermission: {
            resource: "appointments",
            action: "list"
          }
        },
        {
          title: "Ajouter un rendez-vous",
          url: "/appointments/add",
          icon: Plus,
          requiredPermission: {
            resource: "appointments",
            action: "create"
          }
        }
      ]
    },
    {
      title: "Rapports",
      url: "/reports",
      icon: BarChart3,
      isActive: pathname.startsWith("/reports"),
      requiredPermission: {
        resource: "reports",
        action: "list"
      },
      items: [
        {
          title: "Tableau de bord",
          url: "/reports",
          icon: BarChart3,
          requiredPermission: {
            resource: "reports",
            action: "list"
          }
        },
        {
          title: "Rapports détaillés",
          url: "/reports/detailed",
          icon: FileText,
          requiredPermission: {
            resource: "reports",
            action: "list"
          }
        }
      ]
    },
    {
      title: "Laboratoire",
      url: "/lab-results",
      icon: Beaker,
      isActive: pathname.startsWith("/lab-results"),
      requiredPermission: {
        resource: "lab_results",
        action: "list"
      },
      items: [
        {
          title: "Résultats de laboratoire",
          url: "/lab-results",
          icon: Beaker,
          requiredPermission: {
            resource: "lab_results",
            action: "list"
          }
        },
        {
          title: "Ajouter un résultat",
          url: "/lab-results/add",
          icon: Plus,
          requiredPermission: {
            resource: "lab_results",
            action: "create"
          }
        }
      ]
    },
    {
      title: "Activités",
      url: "/activities",
      icon: Activity,
      isActive: pathname.startsWith("/activities"),
      requiredPermission: {
        resource: "activities",
        action: "list"
      },
      items: [
        {
          title: "Journal des activités",
          url: "/activities",
          icon: Activity,
          requiredPermission: {
            resource: "activities",
            action: "list"
          }
        }
      ]
    }
  ];

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Stethoscope className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">CSDMP</span>
                  <span className="truncate text-xs">Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={menuItems} loading={loading} />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}