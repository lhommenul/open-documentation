export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    const url = new URL(`${config.openAuthenticationApiUrl}/oauth/v2/authorize`);
    
    url.searchParams.set('client_id', config.clientId);
    url.searchParams.set('redirect_uri', config.redirectUrl);
    url.searchParams.set('scope', 'openid');
    url.searchParams.set('response_type', 'code');

    return sendRedirect(event, url.toString());
});