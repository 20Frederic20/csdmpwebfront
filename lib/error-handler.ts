/**
 * Utilitaire de gestion d'erreurs HTTP centralisé
 * Gère les codes d'erreur courants avec des messages personnalisés
 */

export interface ErrorHandlerOptions {
  resource?: string;
  action?: string;
  customMessages?: Record<number, string>;
}

/**
 * Gère les erreurs HTTP et retourne un message d'erreur approprié
 * @param response - La réponse HTTP
 * @param options - Options de personnalisation
 * @returns Message d'erreur formaté
 */
export function handleHttpError(
  response: Response, 
  options: ErrorHandlerOptions = {}
): string {
  const { resource = 'ressource', action = 'accéder', customMessages = {} } = options;

  // Messages personnalisés fournis
  if (customMessages[response.status]) {
    return customMessages[response.status];
  }

  // Messages par défaut selon le code d'erreur
  switch (response.status) {
    case 401:
      return "Utilisateur non connecté. Veuillez vous reconnecter.";
    
    case 403:
      return `Vous n'avez pas les permissions pour ${action} ${resource}.`;
    
    case 404:
      return `${resource.charAt(0).toUpperCase() + resource.slice(1)} non trouvé(e).`;
    
    default:
      // Pour les autres codes, utiliser le message par défaut
      return `Erreur ${response.status}: ${response.statusText || 'Erreur inconnue'}`;
  }
}

/**
 * Gestionnaire d'erreurs pour les requêtes fetch
 * @param response - La réponse HTTP
 * @param options - Options de personnalisation
 * @throws Error avec le message approprié
 */
export async function handleFetchError(
  response: Response,
  options: ErrorHandlerOptions = {}
): Promise<never> {
  const message = handleHttpError(response, options);
  throw new Error(message);
}

/**
 * Crée un gestionnaire d'erreurs pour un service spécifique
 * @param serviceName - Nom du service (ex: 'patients', 'users')
 * @returns Fonction de gestion d'erreurs configurée
 */
export function createServiceErrorHandler(serviceName: string) {
  return (response: Response, action: string, customMessages?: Record<number, string>) => {
    return handleFetchError(response, {
      resource: serviceName,
      action,
      customMessages
    });
  };
}

// Exemples d'utilisation:
// 
// Pour le service patients:
// const patientErrorHandler = createServiceErrorHandler('patients');
// await patientErrorHandler(response, 'modifier');
//
// Pour un cas personnalisé:
// handleFetchError(response, {
//   resource: 'utilisateur',
//   action: 'supprimer',
//   customMessages: {
//     409: 'Cet utilisateur est lié à des données et ne peut être supprimé.'
//   }
// });
