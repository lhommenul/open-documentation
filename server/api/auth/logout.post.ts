export default defineEventHandler(async (event) => {
    // Supprimer les cookies d'authentification
    deleteCookie(event, 'auth_token');
    deleteCookie(event, 'refresh_token');

    return {
        success: true,
        message: 'Logged out successfully'
    };
});

