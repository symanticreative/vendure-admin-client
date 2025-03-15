import { ApolloClient, DocumentNode, NormalizedCacheObject, gql } from '@apollo/client';
import { createApolloClient } from './apollo-client';
import { AuthResponse, VendureAdminClientConfig } from '../types';
import { LOGIN_MUTATION, LOGOUT_MUTATION } from '../graphql/auth';

/**
 * Client for interacting with the Vendure Admin API
 * Implemented as a singleton to ensure only one instance exists
 */
export class VendureAdminClient {
  private config: VendureAdminClientConfig;
  private token: string | null = null;
  private refreshToken: string | null = null;
  private client: ApolloClient<NormalizedCacheObject>;
  
  // Singleton instance
  private static instance: VendureAdminClient | null = null;

  /**
   * Private constructor to prevent direct instantiation
   * @param config - Configuration options for the client
   */
  private constructor(config: VendureAdminClientConfig) {
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
   * Get or create the singleton instance
   * @param config - Configuration options for the client
   * @returns The singleton instance of VendureAdminClient
   */
  public static getInstance(config?: VendureAdminClientConfig): VendureAdminClient {
    if (!VendureAdminClient.instance && !config) {
      throw new Error('VendureAdminClient must be initialized with configuration first');
    }
    
    if (!VendureAdminClient.instance && config) {
      VendureAdminClient.instance = new VendureAdminClient(config);
    } else if (config && VendureAdminClient.instance) {
      // If config is provided but instance exists, update the instance configuration
      VendureAdminClient.instance.updateConfig(config);
    }
    
    return VendureAdminClient.instance!;
  }

  /**
   * Reset the singleton instance (mainly for testing purposes)
   */
  public static resetInstance(): void {
    VendureAdminClient.instance = null;
  }

  /**
   * Update client configuration
   * @param config - New configuration options
   */
  private updateConfig(config: Partial<VendureAdminClientConfig>): void {
    const newConfig = {
      ...this.config,
      ...config,
    };

    // Only recreate the Apollo client if the API URL changed
    if (config.apiUrl && config.apiUrl !== this.config.apiUrl) {
      this.client = createApolloClient(
        config.apiUrl,
        this.getAuthToken.bind(this)
      );
    }

    // Update tokens if provided
    if (config.authToken) {
      this.token = config.authToken;
    }

    if (config.refreshToken) {
      this.refreshToken = config.refreshToken;
    }

    this.config = newConfig as VendureAdminClientConfig;
  }

  /**
   * Get the underlying Apollo client instance
   * @returns The Apollo client instance
   */
  public getApolloClient(): ApolloClient<NormalizedCacheObject> {
    return this.client;
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
   * Execute a custom GraphQL operation (query or mutation)
   * Allows for extending the client with custom operations
   * 
   * @param operation - Custom GraphQL operation (query or mutation) as string or DocumentNode
   * @param variables - Variables for the GraphQL operation
   * @param options - Additional options for the operation
   * @returns Promise resolving to the operation result
   */
  public async executeCustomOperation<T = any>(
    operation: string | DocumentNode,
    variables?: Record<string, any>,
    options?: { 
      type?: 'query' | 'mutation',
      fetchPolicy?: string
    }
  ): Promise<T> {
    const operationType = options?.type || 'query';
    const gqlOperation = typeof operation === 'string' ? gql(operation) : operation;
    
    try {
      if (operationType === 'query') {
        const { data } = await this.client.query({
          query: gqlOperation,
          variables,
          fetchPolicy: options?.fetchPolicy as any || 'network-only'
        });
        return data as T;
      } else {
        const { data } = await this.client.mutate({
          mutation: gqlOperation,
          variables
        });
        return data as T;
      }
    } catch (error) {
      console.error(`Custom operation error (${operationType}):`, error);
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
