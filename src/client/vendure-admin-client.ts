import { ApolloClient, DocumentNode, NormalizedCacheObject, gql } from '@apollo/client';
import { createApolloClient } from './apollo-client';
import { AuthResponse, VendureAdminClientConfig } from '../types';
import { LOGIN_MUTATION, LOGOUT_MUTATION } from '../graphql/auth';

/**
 * Client for interacting with the Vendure Admin API
 */
export class VendureAdminClient {
  private config: VendureAdminClientConfig;
  private token: string | null = null;
  private refreshToken: string | null = null;
  private client: ApolloClient<NormalizedCacheObject>;

  /**
   * Create a new Vendure Admin API client
   * 
   * @param config - Configuration options for the client
   */
  constructor(config: VendureAdminClientConfig) {
    this.config = {
      timeout: 10000, // Default timeout
      ...config,
    };

    if (config.authToken) {
      this.token = config.authToken;
    }

    if (config.refreshToken) {
      this.refreshToken = config.refreshToken;
    }

    // Create Apollo client with current configuration
    this.client = createApolloClient(
      this.config.apiUrl,
      this.getAuthToken.bind(this)
    );
  }

  /**
   * Get the current authentication token
   * @returns The current authentication token or null if not authenticated
   */
  public getAuthToken(): string | null {
    return this.token;
  }

  /**
   * Get the current refresh token
   * @returns The current refresh token or null if not available
   */
  public getRefreshToken(): string | null {
    return this.refreshToken;
  }

  /**
   * Set the authentication token
   * @param token - The authentication token
   */
  public setAuthToken(token: string): void {
    this.token = token;
  }

  /**
   * Set the refresh token
   * @param token - The refresh token
   */
  public setRefreshToken(token: string): void {
    this.refreshToken = token;
  }

  /**
   * Check if the client is authenticated
   * @returns True if the client has an authentication token
   */
  public isAuthenticated(): boolean {
    return !!this.token;
  }

  /**
   * Authenticate with the Vendure Admin API
   * 
   * @param username - Admin username
   * @param password - Admin password
   * @param rememberMe - Whether to request a refresh token
   * @returns Promise resolving to the authentication response
   */
  public async login(
    username: string, 
    password: string, 
    rememberMe: boolean = false
  ): Promise<AuthResponse> {
    try {
      const { data } = await this.client.mutate({
        mutation: gql(LOGIN_MUTATION),
        variables: { 
          username, 
          password,
          rememberMe
        }
      });

      if (data.login.errorCode) {
        throw new Error(`Login failed: ${data.login.message}`);
      }

      // Create mock response for now - would be replaced with actual API response
      const authResponse: AuthResponse = {
        token: `mock-token-${Date.now()}`,
        refreshToken: rememberMe ? `mock-refresh-token-${Date.now()}` : undefined,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        user: data.login
      };
      
      this.token = authResponse.token;
      
      if (authResponse.refreshToken) {
        this.refreshToken = authResponse.refreshToken;
      }
      
      return authResponse;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Execute a GraphQL query against the Vendure Admin API
   * 
   * @param query - The GraphQL query string or DocumentNode
   * @param variables - Variables for the GraphQL query
   * @returns Promise resolving to the query result
   */
  public async query<T = any>(
    query: string | DocumentNode, 
    variables?: Record<string, any>
  ): Promise<T> {
    try {
      const queryToExecute = typeof query === 'string' ? gql(query) : query;
      
      const { data } = await this.client.query({
        query: queryToExecute,
        variables
      });
      
      return data as T;
    } catch (error) {
      console.error('Query error:', error);
      throw error;
    }
  }

  /**
   * Execute a GraphQL mutation against the Vendure Admin API
   * 
   * @param mutation - The GraphQL mutation string or DocumentNode
   * @param variables - Variables for the GraphQL mutation
   * @returns Promise resolving to the mutation result
   */
  public async mutate<T = any>(
    mutation: string | DocumentNode, 
    variables?: Record<string, any>
  ): Promise<T> {
    try {
      const mutationToExecute = typeof mutation === 'string' ? gql(mutation) : mutation;
      
      const { data } = await this.client.mutate({
        mutation: mutationToExecute,
        variables
      });
      
      return data as T;
    } catch (error) {
      console.error('Mutation error:', error);
      throw error;
    }
  }

  /**
   * Logout and clear the authentication token
   */
  public async logout(): Promise<void> {
    if (this.isAuthenticated()) {
      try {
        await this.client.mutate({
          mutation: gql(LOGOUT_MUTATION)
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    this.token = null;
    this.refreshToken = null;
  }
}
