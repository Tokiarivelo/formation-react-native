import { Token } from '../../constants';
import * as Keychain from 'react-native-keychain';
import { AuthTokens } from '../../types/api';

/**
 * Stores both access and refresh tokens securely using Keychain.
 * We use 'username' as a dummy value and 'password' to store the token string.
 */
export const saveTokens = async ({ accessToken, refreshToken }: AuthTokens): Promise<void> => {
    try {
        // Store Access Token
        await Keychain.setGenericPassword(
            Token.KEYCHAIN_SERVICE_ACCESS, // Username (used as key/service)
            accessToken,             // Password (the value to store)
            { service: Token.KEYCHAIN_SERVICE_ACCESS }
        );

        // Store Refresh Token
        await Keychain.setGenericPassword(
            Token.KEYCHAIN_SERVICE_REFRESH,
            refreshToken,
            { service: Token.KEYCHAIN_SERVICE_REFRESH }
        );

        console.log('Tokens saved successfully to SecureStore.');
    } catch (e) {
        console.error('Error saving tokens to SecureStore:', e);
    }
};

/**
 * Retrieves the refresh token needed for the refresh endpoint.
 */
export const getAccessToken = async (): Promise<string | null> => {
    try {
        const credentials = await Keychain.getGenericPassword({
            service: Token.KEYCHAIN_SERVICE_ACCESS
        });

        if (credentials && credentials.password) {
            // In Keychain, the stored value is returned as the 'password' field.
            return credentials.password;
        }
        return null;

    } catch (e) {
        console.error('Error retrieving access token from SecureStore:', e);
        return null;
    }
};

/**
 * Retrieves the refresh token needed for the refresh endpoint.
 */
export const getRefreshToken = async (): Promise<string | null> => {
    try {
        const credentials = await Keychain.getGenericPassword({
            service: Token.KEYCHAIN_SERVICE_REFRESH
        });

        if (credentials && credentials.password) {
            // In Keychain, the stored value is returned as the 'password' field.
            return credentials.password;
        }
        return null;

    } catch (e) {
        console.error('Error retrieving refresh token from SecureStore:', e);
        return null;
    }
};

/**
 * Clears all locally stored tokens from Keychain.
 */
export const clearTokens = async (): Promise<void> => {
    try {
        await Keychain.resetGenericPassword({ service: Token.KEYCHAIN_SERVICE_ACCESS });
        await Keychain.resetGenericPassword({ service: Token.KEYCHAIN_SERVICE_REFRESH });
        console.log('Tokens cleared successfully from SecureStore.');
    } catch (e) {
        console.error('Error clearing tokens from SecureStore:', e);
    }
};