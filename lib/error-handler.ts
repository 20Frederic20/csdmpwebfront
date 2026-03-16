/**
 * Utilitaire de gestion d'erreurs HTTP centralisé
 * Gère les codes d'erreur courants avec des messages personnalisés en français
 */

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export interface ErrorHandlerOptions {
  resource?: string;
  action?: string;
  customMessages?: Record<number, string>;
}

/**
 * Gère les erreurs HTTP et retourne un message d'erreur approprié en français
 * @param status - Le code de statut HTTP
 * @param statusText - Le message de statut par défaut
 * @param options - Options de personnalisation
 * @returns Message d'erreur formaté
 */
export function getErrorMessage(
  status: number,
  statusText: string = '',
  options: ErrorHandlerOptions = {}
): string {
  const { resource = 'ressource', action = 'traiter', customMessages = {} } = options;

  // Messages personnalisés fournis
  if (customMessages[status]) {
    return customMessages[status];
  }

  // Messages par défaut selon le code d'erreur
  switch (status) {
    case 400:
      return "Requête invalide. Veuillez vérifier les informations saisies.";
    
    case 401:
      return "Session expirée ou utilisateur non connecté. Veuillez vous reconnecter.";
    
    case 403:
      return `Accès refusé. Vous n'avez pas les permissions pour ${action} cette ${resource}.`;
    
    case 404:
      return `${resource.charAt(0).toUpperCase() + resource.slice(1)} introuvable.`;
    
    case 409:
      return `Conflit : Cette ${resource} existe déjà ou est déjà utilisée.`;
    
    case 422:
      return "Erreur de validation. Les données envoyées sont incorrectes.";
    
    case 500:
      return "Erreur interne du serveur. Veuillez réessayer plus tard.";
    
    case 503:
      return "Service temporairement indisponible. Le serveur est en maintenance.";
    
    default:
      return `Erreur ${status}: ${statusText || 'Une erreur inattendue est survenue'}`;
  }
}

/**
 * Ancienne fonction maintenue pour compatibilité mais mise à jour
 */
export function handleHttpError(
  response: Response, 
  options: ErrorHandlerOptions = {}
): string {
  return getErrorMessage(response.status, response.statusText, options);
}

/**
 * Gestionnaire d'erreurs pour les requêtes fetch
 * @param response - La réponse HTTP
 * @param options - Options de personnalisation
 * @throws ApiError avec le message approprié
 */
export async function handleFetchError(
  response: Response,
  options: ErrorHandlerOptions = {}
): Promise<never> {
  const message = handleHttpError(response, options);
  
  let data = null;
  try {
    data = await response.json();
  } catch (e) {
    // Ignorer si pas de JSON en retour
  }
  
  throw new ApiError(message, response.status, data);
}

/**
 * Crée un gestionnaire d'erreurs pour un service spécifique
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
