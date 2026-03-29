import { NextRequest, NextResponse } from 'next/server';

/**
 * Décode un JWT sans vérification de signature (lecture des claims publics).
 * La vérification a déjà lieu côté backend lors de chaque requête authentifiée.
 * Le middleware garantit qu'un token invalide ne passe pas ici.
 */
function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const [, payloadB64] = token.split('.');
    if (!payloadB64) return null;

    // Convertir base64url → base64 standard
    const base64 = payloadB64.replace(/-/g, '+').replace(/_/g, '/');
    const json = Buffer.from(base64, 'base64').toString('utf-8');
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  const payload = decodeJwt(accessToken);

  if (!payload) {
    return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
  }

  // Vérifier l'expiration
  const exp = payload['exp'];
  if (typeof exp === 'number' && Date.now() / 1000 > exp) {
    return NextResponse.json({ error: 'Token expiré' }, { status: 401 });
  }

  // Extraire les claims utiles encodés dans le token par le backend
  const permissions = (payload['permissions'] as string[] | undefined) ?? [];

  const user = {
    id: payload['sub'] as string,
    health_id: payload['health_id'] as string | undefined,
    email: payload['email'] as string | undefined,
    name: payload['name'] as string | undefined,
    is_admin: payload['is_admin'] as boolean | undefined,
    is_superadmin: payload['is_superadmin'] as boolean | undefined,
    roles: (payload['roles'] as string[] | undefined) ?? [],
    // Le backend encode les permissions en "RESOURCE:ACTION"
    permissions: permissions.map((p: string) => {
      const [resource, action] = p.split(':');
      return { resource: resource ?? p, action: action ?? '' };
    }),
    // Champs de profil optionnels
    patient_id: payload['patient_id'] as string | undefined,
    hospital_staff_id: payload['hospital_staff_id'] as string | undefined,
    hospital_staff_matricule: payload['hospital_staff_matricule'] as string | undefined,
    hospital_staff_specialty: payload['hospital_staff_specialty'] as string | undefined,
    health_facility_id: payload['health_facility_id'] as string | undefined,
    health_facility_name: payload['health_facility_name'] as string | undefined,
    health_facility_phone: payload['health_facility_phone'] as string | undefined,
  };

  return NextResponse.json(user);
}
