import { UserRole } from "../types/user.types";

export const USER_ROLES_LABELS: Record<UserRole, string> = {
  USER: "Utilisateur",
  PARENT: "Parent",
  PATIENT: "Patient",
  HEALTH_PRO: "Professionnel de santé",
  DOCTOR: "Médecin",
  NURSE: "Infirmier",
  MIDWIFE: "Sage-femme",
  LAB_TECHNICIAN: "Technicien de labo",
  PHARMACIST: "Pharmacien",
  COMMUNITY_AGENT: "Agent communautaire",
  ADMIN: "Administrateur",
  SUPER_ADMIN: "Super administrateur",
};

export const formatUserRole = (role: UserRole): string => {
  return USER_ROLES_LABELS[role] || role;
};

export const formatUserRoles = (roles: UserRole[]): string => {
  if (!roles || roles.length === 0) return "—";
  return roles.map(formatUserRole).join(", ");
};

export const getUserRoleBadge = (role: UserRole) => {
  switch (role) {
    case 'SUPER_ADMIN':
      return { label: formatUserRole(role), variant: 'destructive' as const };
    case 'ADMIN':
      return { label: formatUserRole(role), variant: 'destructive' as const };
    case 'DOCTOR':
      return { label: formatUserRole(role), variant: 'default' as const };
    case 'NURSE':
      return { label: formatUserRole(role), variant: 'secondary' as const };
    case 'MIDWIFE':
      return { label: formatUserRole(role), variant: 'secondary' as const };
    case 'PHARMACIST':
      return { label: formatUserRole(role), variant: 'default' as const };
    case 'LAB_TECHNICIAN':
      return { label: formatUserRole(role), variant: 'outline' as const };
    case 'COMMUNITY_AGENT':
      return { label: formatUserRole(role), variant: 'outline' as const };
    case 'HEALTH_PRO':
      return { label: formatUserRole(role), variant: 'default' as const };
    case 'PATIENT':
      return { label: formatUserRole(role), variant: 'outline' as const };
    case 'PARENT':
      return { label: formatUserRole(role), variant: 'outline' as const };
    default:
      return { label: formatUserRole(role), variant: 'outline' as const };
  }
};

export const getUserRolesBadges = (roles: UserRole[]) => {
  if (!roles || roles.length === 0) return [];
  return roles.map(getUserRoleBadge);
};

export const getPrimaryRole = (roles: UserRole[]): UserRole | null => {
  if (!roles || roles.length === 0) return null;
  
  // Ordre de priorité des rôles
  const priorityOrder: UserRole[] = [
    'SUPER_ADMIN',
    'ADMIN',
    'DOCTOR',
    'PHARMACIST',
    'NURSE',
    'MIDWIFE',
    'LAB_TECHNICIAN',
    'HEALTH_PRO',
    'COMMUNITY_AGENT',
    'PARENT',
    'PATIENT',
    'USER'
  ];

  for (const role of priorityOrder) {
    if (roles.includes(role)) {
      return role;
    }
  }

  return roles[0];
};

export const getUserStatusBadge = (isActive: boolean) => {
  return isActive 
    ? { label: 'Actif', variant: 'default' as const }
    : { label: 'Inactif', variant: 'destructive' as const };
};

export const getUserFullName = (givenName: string, familyName: string): string => {
  return `${givenName} ${familyName}`.trim();
};

export const getUserInitials = (givenName: string, familyName: string): string => {
  const firstInitial = givenName.charAt(0).toUpperCase();
  const lastInitial = familyName.charAt(0).toUpperCase();
  return `${firstInitial}${lastInitial}`;
};

export const filterUsersByRole = (users: any[], role: UserRole): any[] => {
  return users.filter(user => user.roles && user.roles.includes(role));
};

export const filterActiveUsers = (users: any[]): any[] => {
  return users.filter(user => user.is_active);
};

export const sortUsersByName = (users: any[]): any[] => {
  return [...users].sort((a, b) => {
    const nameA = getUserFullName(a.given_name, a.family_name).toLowerCase();
    const nameB = getUserFullName(b.given_name, b.family_name).toLowerCase();
    return nameA.localeCompare(nameB);
  });
};
