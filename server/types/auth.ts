export interface OAuthTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
    scope?: string;
}

export interface TokenApiResponse {
    success: boolean;
    data?: OAuthTokenResponse;
}

