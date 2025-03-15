import { ApolloClient, InMemoryCache, createHttpLink, from, NormalizedCacheObject, DocumentNode, gql } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import fetch from 'cross-fetch';
import { VendureAdminClientConfig } from '../config/client-config';
import { Injectable } from '../di/injectable.decorator';

/**
 * GraphQL client service for making GraphQL requests
 * This is used by repositories to execute GraphQL operations
 */
@Injectable()
export class GraphQLClientService {
  private client: ApolloClient<NormalizedCacheObject>;
  private config: VendureAdminClientConfig;
  private authToken: string | null = null;
  private refreshToken: string | null = null;

  /**
   * Initialize the GraphQL client with configuration
   * @param config - Vendure Admin client configuration
   */
  constructor(config: VendureAdminClientConfig) {
    this.config = {
      timeout: 10000, // Default timeout
      ...config,
    };

    if (config.authToken) {
      this.authToken = config.authToken;
    }

    if (config.refreshToken) {
      this.refreshToken = config.refreshToken;
    }

    this.client = this.createApolloClient();
  }

  /**
   * Create Apollo client instance
   * @returns Configured Apollo Client
   */
  private createApolloClient(): ApolloClient<NormalizedCacheObject> {
    // Create HTTP link to the GraphQL endpoint
    const httpLink = createHttpLink({
      uri: this.config.apiUrl,
      fetch
    });

    // Add auth token to each request
    const authLink = setContext((_, { headers }) => {
      const token = this.getAuthToken();
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : '',
        },
      };
    });

    // Create and return the Apollo Client
    return new ApolloClient({
      link: from([authLink, httpLink]),
      cache: new InMemoryCache(),
      defaultOptions: {
        query: {
          fetchPolicy: 'network-only', // Don't use cache for queries by default
          errorPolicy: 'all'
        },
        mutate: {
          errorPolicy: 'all'
        },
        watchQuery: {
          fetchPolicy: 'network-only',
          errorPolicy: 'all'
        }
      }
    });
  }

  /**
   * Execute a GraphQL query
   * @param query - GraphQL query or DocumentNode
   * @param variables - Query variables
   * @returns Promise with query result
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
   * Execute a GraphQL mutation
   * @param mutation - GraphQL mutation or DocumentNode
   * @param variables - Mutation variables
   * @returns Promise with mutation result
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
   * @param operation - GraphQL operation or DocumentNode
   * @param variables - Operation variables
   * @param options - Additional options
   * @returns Promise with operation result
   */
  public async executeOperation<T = any>(
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
   * Update client configuration
   * @param config - New configuration options
   */
  public updateConfig(config: Partial<VendureAdminClientConfig>): void {
    const newConfig = {
      ...this.config,
      ...config,
    };

    // Only recreate the Apollo client if the API URL changed
    if (config.apiUrl && config.apiUrl !== this.config.apiUrl) {
      this.config = newConfig as VendureAdminClientConfig;
      this.client = this.createApolloClient();
    } else {
      this.config = newConfig as VendureAdminClientConfig;
    }

    // Update tokens if provided
    if (config.authToken) {
      this.authToken = config.authToken;
    }

    if (config.refreshToken) {
      this.refreshToken = config.refreshToken;
    }
  }

  /**
   * Get the current authentication token
   * @returns Current auth token or null
   */
  public getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * Get the current refresh token
   * @returns Current refresh token or null
   */
  public getRefreshToken(): string | null {
    return this.refreshToken;
  }

  /**
   * Set the authentication token
   * @param token - Auth token
   */
  public setAuthToken(token: string): void {
    this.authToken = token;
  }

  /**
   * Set the refresh token
   * @param token - Refresh token
   */
  public setRefreshToken(token: string): void {
    this.refreshToken = token;
  }

  /**
   * Check if authenticated
   * @returns True if auth token exists
   */
  public isAuthenticated(): boolean {
    return !!this.authToken;
  }

  /**
   * Get the underlying Apollo client
   * @returns Apollo client instance
   */
  public getApolloClient(): ApolloClient<NormalizedCacheObject> {
    return this.client;
  }
}
