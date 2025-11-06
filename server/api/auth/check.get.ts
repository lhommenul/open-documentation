export default defineEventHandler(async (event) => {
    const authToken = getCookie(event, 'auth_token');

    return {
        authenticated: !!authToken
    };
});

