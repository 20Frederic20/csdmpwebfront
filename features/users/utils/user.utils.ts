import { UserRole } from "../types/user.types";

export const USER_ROLES_LABELS: Record<UserRole, string> = {
  user: "Utilisateur",
  parent: "Parent",
  patient: "Patient",
  health_pro: "Professionnel de santé",
  doctor: "Médecin",
  nurse: "Infirmier",
  midwife: "Sage-femme",
  lab_technician: "Technicien de labo",
  pharmacist: "Pharmacien",
  community_agent: "Agent communautaire",
  admin: "Administrateur",
  super_admin: "Super administrateur",
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
    case 'super_admin':
      return { label: formatUserRole(role), variant: 'destructive' as const };
    case 'admin':
      return { label: formatUserRole(role), variant: 'destructive' as const };
    case 'doctor':
      return { label: formatUserRole(role), variant: 'default' as const };
    case 'nurse':
      return { label: formatUserRole(role), variant: 'secondary' as const };
    case 'midwife':
      return { label: formatUserRole(role), variant: 'secondary' as const };
    case 'pharmacist':
      return { label: formatUserRole(role), variant: 'default' as const };
    case 'lab_technician':
      return { label: formatUserRole(role), variant: 'outline' as const };
    case 'community_agent':
      return { label: formatUserRole(role), variant: 'outline' as const };
    case 'health_pro':
      return { label: formatUserRole(role), variant: 'default' as const };
    case 'patient':
      return { label: formatUserRole(role), variant: 'outline' as const };
    case 'parent':
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
    'super_admin',
    'admin',
    'doctor',
    'pharmacist',
    'nurse',
    'midwife',
    'lab_technician',
    'health_pro',
    'community_agent',
    'parent',
    'patient',
    'user'
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
