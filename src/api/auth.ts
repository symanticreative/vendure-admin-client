import { VendureAdminClient } from '../client/vendure-admin-client';
import { AuthResponse, CurrentUser } from '../types';
import { GET_CURRENT_USER } from '../graphql/auth';

/**
 * Authentication credentials
 */
export interface AuthCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Global authentication state
 */
let globalClient: VendureAdminClient | null = null;

/**
 * Set the global admin credentials
 * 
 * @param config - Configuration containing API URL and optional auth token
 */
export function setAdminCredentials(config: {
  apiUrl: string;
  authToken?: string;
  refreshToken?: string;
}): void {
  globalClient = new VendureAdminClient({
    apiUrl: config.apiUrl,
    authToken: config.authToken,
    refreshToken: config.refreshToken
  });
}

/**
 * Get the global client instance
 * @returns The global VendureAdminClient instance
 * @throws Error if credentials have not been set
 */
export function getClient(): VendureAdminClient {
  if (!globalClient) {
    throw new Error(
      'Admin credentials not set. Call setAdminCredentials() before making API calls.'
    );
  }
  return globalClient;
}

/**
 * Login to the Vendure Admin API
 * 
 * @param credentials - Authentication credentials
 * @returns Promise resolving to the authentication response
 */
export async function loginAdmin(
  credentials: AuthCredentials
): Promise<AuthResponse> {
  const client = getClient();
  return client.login(
    credentials.email,
    credentials.password,
    credentials.rememberMe ?? false
  );
}

/**
 * Logout from the Vendure Admin API
 * 
 * @returns Promise resolving when logout is complete
 */
export async function logoutAdmin(): Promise<void> {
  const client = getClient();
  return client.logout();
}

/**
 * Get the current authenticated user
 * 
 * @returns Promise resolving to the current user information
 */
export async function getCurrentUser(): Promise<CurrentUser> {
  const client = getClient();
  const result = await client.query<{ me: CurrentUser }>(GET_CURRENT_USER);
  return result.me;
}
