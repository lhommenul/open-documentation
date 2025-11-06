import type { H3Event } from 'h3';

/**
 * Récupère le token d'authentification depuis les cookies
 */
export const getAuthToken = (event: H3Event): string | undefined => {
    return getCookie(event, 'auth_token');
};

/**
 * Récupère le refresh token depuis les cookies
 */
export const getRefreshToken = (event: H3Event): string | undefined => {
    return getCookie(event, 'refresh_token');
};

/**
 * Vérifie si l'utilisateur est authentifié
 */
export const isAuthenticated = (event: H3Event): boolean => {
    return !!getAuthToken(event);
};

/**
 * Middleware pour protéger les routes qui nécessitent une authentification
 */
export const requireAuth = (event: H3Event) => {
    if (!isAuthenticated(event)) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Authentication required'
        });
    }
    return getAuthToken(event);
};

