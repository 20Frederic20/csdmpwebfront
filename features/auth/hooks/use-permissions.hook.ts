import { useQuery } from "@tanstack/react-query";
import { PermissionsService } from "../services/permissions.service";
import { UserWithRoles } from "../types/roles.types";

export const PERMISSIONS_QUERY_KEY = ["user_permissions"];
const CACHE_TIME = 60 * 60 * 1000; // 1 heure en millisecondes

export function usePermissionsQuery() {
    return useQuery<UserWithRoles>({
        queryKey: PERMISSIONS_QUERY_KEY,
        queryFn: () => PermissionsService.getUserPermissions(),
        staleTime: CACHE_TIME,
        gcTime: CACHE_TIME,
        retry: false,
    });
}
