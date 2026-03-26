"use client"

import { useEffect, useState } from "react"


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
  SidebarMenuSubButton,
  SidebarMenuSubItem,
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
  FileText as PrescriptionIcon,
  Receipt,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { usePermissionsContext } from "@/contexts/permissions-context"

function NavMain({
  items,
  loading,
  canAccess
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
  canAccess?: (resource: string, action: string) => boolean
}) {
  const pathname = usePathname();

  // Afficher le menu même pendant le chargement, mais sans filtrer les permissions
  if (loading) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} isActive={item.isActive} asChild>
                <Link href={item.url || "#"}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
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
          if (item.requiredPermission && canAccess && !canAccess(item.requiredPermission.resource, item.requiredPermission.action)) {
            return null;
          }

          const hasSubItems = item.items && item.items.length > 0;

          if (!hasSubItems) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} isActive={item.isActive} asChild>
                  <Link href={item.url || "#"}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title} isActive={item.isActive}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      if (subItem.requiredPermission && canAccess && !canAccess(subItem.requiredPermission.resource, subItem.requiredPermission.action)) {
                        return null;
                      }
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
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
  );
}

export function AppSidebar() {
  const pathname = usePathname()
  const { loading, canAccess } = usePermissionsContext()

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
      ]
    },
    {
      title: "Chambres",
      url: "/rooms",
      icon: Building,
      isActive: pathname.startsWith("/rooms"),
      requiredPermission: {
        resource: "rooms",
        action: "list"
      },
      items: [
        {
          title: "Liste des chambres",
          url: "/rooms",
          icon: Building,
          requiredPermission: {
            resource: "rooms",
            action: "list"
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
          // requiredPermission: {
          //   resource: "reports",
          //   action: "list"
          // }
        },
        {
          title: "Rapports détaillés",
          url: "/reports/detailed",
          icon: FileText,
          // requiredPermission: {
          //   resource: "reports",
          //   action: "list"
          // }
        }
      ]
    },
    {
      title: "Laboratoire",
      url: "/lab-results",
      icon: Beaker,
      isActive: pathname.startsWith("/lab-results") || pathname.startsWith("/lab-parameter-norms") || pathname.startsWith("/lab-exam-definitions"),
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
          title: "Normes de laboratoire",
          url: "/lab-parameter-norms",
          icon: Activity,
          requiredPermission: {
            resource: "lab_parameter_norms",
            action: "list"
          }
        },
        {
          title: "Définitions d'examens",
          url: "/lab-exam-definitions",
          icon: FileText,
          requiredPermission: {
            resource: "exam_definitions",
            action: "list"
          }
        },
      ]
    },
    {
      title: "Prescriptions",
      url: "/prescriptions",
      icon: PrescriptionIcon,
      isActive: pathname.startsWith("/prescriptions"),
      requiredPermission: {
        resource: "prescriptions",
        action: "list"
      },
      items: [
        {
          title: "Liste des prescriptions",
          url: "/prescriptions",
          icon: PrescriptionIcon,
          requiredPermission: {
            resource: "prescriptions",
            action: "list"
          }
        },
      ]
    },
    {
      title: "Facturation",
      url: "/billing",
      icon: Receipt,
      isActive: pathname.startsWith("/billing"),
      requiredPermission: {
        resource: "invoices",
        action: "list"
      },
      items: [
        {
          title: "Liste des factures",
          url: "/billing",
          icon: Receipt,
          requiredPermission: {
            resource: "invoices",
            action: "list"
          }
        }
      ]
    },
    {
      title: "Services médicaux",
      url: "/medical-services",
      icon: Stethoscope,
      isActive: pathname.startsWith("/medical-services"),
      requiredPermission: {
        resource: "invoices",
        action: "list"
      }
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
    <Sidebar collapsible="icon" variant="inset" className="border-r border-white/5 bg-medical-bg/95 backdrop-blur-xl">
      <SidebarHeader className="border-b border-white/5 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-white/5 transition-colors">
              <Link href="/dashboard">
                <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-vital-green text-medical-bg vital-glow">
                  <Activity className="size-6" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight ml-3">
                  <span className="truncate font-display font-bold text-lg tracking-tight">CS<span className="text-vital-green">DMP</span></span>
                  <span className="truncate text-[10px] text-medical-muted uppercase tracking-widest font-medium">Santé Connectée</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={menuItems} loading={loading} canAccess={canAccess} />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}