import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DepartmentService } from "../services/departments.service";
import { CreateDepartmentRequest, UpdateDepartmentRequest } from "../types/departments.types";
import { toast } from "sonner";

export const useDepartmentMutations = () => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (data: CreateDepartmentRequest) => DepartmentService.createDepartment(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departments'] });
            toast.success("Département créé avec succès");
        },
        onError: (error: any) => {
            toast.error(error.message || "Erreur lors de la création du département");
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateDepartmentRequest }) =>
            DepartmentService.updateDepartment(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departments'] });
            toast.success("Département mis à jour avec succès");
        },
        onError: (error: any) => {
            toast.error(error.message || "Erreur lors de la mise à jour");
        }
    });

    const toggleMutation = useMutation({
        mutationFn: (id: string) => DepartmentService.toggleDepartmentActivation(id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['departments'] });
            toast.success(`Département ${data.is_active ? 'activé' : 'désactivé'} avec succès`);
        },
        onError: (error: any) => {
            toast.error(error.message || "Erreur lors de la modification du statut");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => DepartmentService.deleteDepartment(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departments'] });
            toast.success("Département supprimé avec succès");
        },
        onError: (error: any) => {
            toast.error(error.message || "Erreur lors de la suppression");
        }
    });

    const softDeleteMutation = useMutation({
        mutationFn: (id: string) => DepartmentService.softDeleteDepartment(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departments'] });
            toast.success("Département supprimé (soft delete) avec succès");
        },
        onError: (error: any) => {
            toast.error(error.message || "Erreur lors de la suppression");
        }
    });

    const permanentlyDeleteMutation = useMutation({
        mutationFn: (id: string) => DepartmentService.permanentlyDeleteDepartment(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departments'] });
            toast.success("Département supprimé définitivement");
        },
        onError: (error: any) => {
            toast.error(error.message || "Erreur lors de la suppression définitive");
        }
    });

    const restoreMutation = useMutation({
        mutationFn: (id: string) => DepartmentService.restoreDepartment(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departments'] });
            toast.success("Département restauré avec succès");
        },
        onError: (error: any) => {
            toast.error(error.message || "Erreur lors de la restauration");
        }
    });

    return {
        createDepartment: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        updateDepartment: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
        toggleStatus: toggleMutation.mutateAsync,
        isToggling: toggleMutation.isPending,
        deleteDepartment: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
        softDeleteDepartment: softDeleteMutation.mutateAsync,
        isSoftDeleting: softDeleteMutation.isPending,
        permanentlyDeleteDepartment: permanentlyDeleteMutation.mutateAsync,
        isPermanentlyDeleting: permanentlyDeleteMutation.isPending,
        restoreDepartment: restoreMutation.mutateAsync,
        isRestoring: restoreMutation.isPending,
    };
};
