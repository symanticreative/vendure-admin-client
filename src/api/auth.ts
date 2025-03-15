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
 * Get the global client instance
 * @returns The VendureAdminClient singleton instance
 * @throws Error if client has not been initialized
 */
export function getClient(): VendureAdminClient {
  try {
    return VendureAdminClient.getInstance();
  } catch (error) {
    throw new Error(
      'Vendure Admin Client not initialized. Initialize VendureAdminClient.getInstance(config) before making API calls.'
    );
  }
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

/**
 * Execute a custom GraphQL operation using the admin client
 * This allows for extending the client with custom queries and mutations
 * 
 * @param operation - Custom GraphQL operation (query or mutation)
 * @param variables - Variables for the GraphQL operation
 * @param options - Additional options for the operation
 * @returns Promise resolving to the operation result
 */
export async function executeCustomOperation<T = any>(
  operation: string | any,
  variables?: Record<string, any>,
  options?: { 
    type?: 'query' | 'mutation',
    fetchPolicy?: string
  }
): Promise<T> {
  const client = getClient();
  return client.executeCustomOperation<T>(operation, variables, options);
}
