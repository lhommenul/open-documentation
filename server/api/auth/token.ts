import type { OAuthTokenResponse, TokenApiResponse } from '~/server/types/auth';

export default defineEventHandler(async (event): Promise<TokenApiResponse> => {
    try {
        const query = getQuery(event);
        const { code } = query;

        if (!code || typeof code !== 'string') {
            throw createError({
                statusCode: 400,
                statusMessage: 'Authorization code is required'
            });
        }

        const config = useRuntimeConfig();

        const tokenResponse = await $fetch<OAuthTokenResponse>(
            `${config.openAuthenticationApiUrl}/oauth/v2/token`,
            {
                method: 'POST',
                body: new URLSearchParams({
                    code: code,
                    client_id: config.clientId,
                    redirect_uri: config.redirectUrl,
                    grant_type: 'authorization_code'
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        // Stocker l'access token dans un cookie sécurisé httpOnly
        setCookie(event, 'auth_token', tokenResponse.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: tokenResponse.expires_in || 3600, // Utilise expires_in ou 1h par défaut
            path: '/'
        });

        // Stocker le refresh token si présent
        if (tokenResponse.refresh_token) {
            setCookie(event, 'refresh_token', tokenResponse.refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 30, // 30 jours
                path: '/'
            });
        }

        return {
            success: true,
            data: tokenResponse
        };
    } catch (error) {

        console.error(error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to exchange authorization code for token',
            data: error
        });
    }
});