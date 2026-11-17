// @ts-check
import { TOKEN_COOKIES_KEYS } from '../constants/ibe_idt_constants';

/**
 * Get the access token from the cookies for Iberia and Iberia Plus users.
 * @returns { string | undefined } The cookie value or undefined if the cookie is not present.
 */
export function getIbisAccessToken() {
    return window.Cookies.get(TOKEN_COOKIES_KEYS.LOGGED_TOKEN);
}

/**
 * Get the refresh token from the cookies for Iberia and Iberia Plus users.
 * @returns { string | undefined } The cookie value or undefined if the cookie is not present.
 */
export function getIbisRefreshToken() {
    return window.Cookies.get(TOKEN_COOKIES_KEYS.LOGGED_REFRESH_TOKEN);
}

/**
 * Utility function to get the information as an object from a JWT token.
 * @param { string | undefined } token The token to get the information from.
 * @returns {Record<string, string> | null} The information of the token as an object.
 */
function getTokenInformation(token) {
    const base64Url = token?.split('.')[1];
    if (!base64Url) {
        return null;
    }
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('')
        .map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join(''));
    return JSON.parse(jsonPayload);
}

/**
 * Get the token information from the access token, for Iberia and Iberia Plus users.
 * @returns {Record<string, string> | null}
 */
function getAccessTokenInformation() {
    const cookieLoggedToken = getIbisAccessToken();
    return getTokenInformation(cookieLoggedToken);
}

/**
 * Get the token information from the refresh token, for Iberia and Iberia Plus users.
 * @returns {Record<string, string> | null}
 */
function getRefreshTokenInformation() {
    const cookieLoggedToken = getIbisRefreshToken();
    return getTokenInformation(cookieLoggedToken);
}

/**
 * Retrieve the identifier from the ibis token. In case of Iberia Plus the identifier
 * is the frequentFlyer, in case of Iberia Zero the identifier is the Account Identifier.
 * @returns {string | null} The frequent flyer or account identifier of the user
 */
export function getIdentifierFromToken() {
    return getAccessTokenInformation()?.sub ?? getRefreshTokenInformation()?.sub ?? null;
}
