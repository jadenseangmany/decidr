import * as SecureStore from 'expo-secure-store';

const USERNAME_KEY = 'auth_username';
const TOKEN_KEY = 'auth_token';

/**
 * Save authentication data after successful login
 */
export async function saveAuth(username: string, token: string): Promise<void> {
    await SecureStore.setItemAsync(USERNAME_KEY, username);
    await SecureStore.setItemAsync(TOKEN_KEY, token);
}

/**
 * Get the stored username
 */
export async function getUsername(): Promise<string | null> {
    return await SecureStore.getItemAsync(USERNAME_KEY);
}

/**
 * Get the stored JWT token
 */
export async function getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(TOKEN_KEY);
}

/**
 * Clear all auth data (for logout)
 */
export async function clearAuth(): Promise<void> {
    await SecureStore.deleteItemAsync(USERNAME_KEY);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
}

/**
 * Check if user is logged in
 */
export async function isLoggedIn(): Promise<boolean> {
    const token = await getToken();
    return token !== null;
}
