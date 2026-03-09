/**
 * @deprecated
 * Ce hook n'est plus utilisé et a été remplacé par usePermissionsContext dans '@/contexts/permissions-context'.
 * Il a été vidé pour supprimer l'utilisation de sessionStorage.
 */
export function usePermissions() {
  throw new Error("usePermissions is deprecated. Use usePermissionsContext from '@/contexts/permissions-context' instead.");
}
