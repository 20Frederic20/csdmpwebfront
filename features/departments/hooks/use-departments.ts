import { useQuery } from "@tanstack/react-query";
import { DepartmentService } from "../services/departments.service";
import { DepartmentFilterParams } from "../types/departments.types";
import { usePermissionsContext } from "@/contexts/permissions-context";

export const useDepartments = (params: DepartmentFilterParams) => {
    const { user, loading: permissionsLoading } = usePermissionsContext();

    return useQuery({
        queryKey: ['departments', params, user?.health_facility_id],
        queryFn: () => DepartmentService.getDepartments({
            ...params,
            health_facility_id: user?.health_facility_id || params.health_facility_id
        }),
        enabled: !permissionsLoading,
        staleTime: 5 * 60 * 1000, // 5 minutes cache
    });
};
