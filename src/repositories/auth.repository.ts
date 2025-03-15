import { Injectable } from '../core/di/injectable.decorator';
import { GraphQLClientService } from '../core/graphql/graphql-client.service';
import { AuthCredentials, AuthResponse, CurrentUser } from '../models/auth.model';
import { LOGIN_MUTATION, LOGOUT_MUTATION, GET_CURRENT_USER } from '../graphql/auth.queries';

/**
 * Repository for authentication operations
 */
@Injectable()
export class AuthRepository {
  constructor(private graphqlClient: GraphQLClientService) {}

  /**
   * Login to the Vendure Admin API
   * @param credentials - Authentication credentials
   * @returns Promise resolving to auth response
   */
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      const { data } = await this.graphqlClient.getApolloClient().mutate({
        mutation: this.graphqlClient.getApolloClient().client.createOperationDefinition(LOGIN_MUTATION),
        variables: { 
          username: credentials.email, 
          password: credentials.password,
          rememberMe: credentials.rememberMe || false
        }
      });

      if (data.login.errorCode) {
        throw new Error(`Login failed: ${data.login.message}`);
      }

      // Mock response until proper JWT handling is implemented
      const authResponse: AuthResponse = {
        token: `mock-token-${Date.now()}`,
        refreshToken: credentials.rememberMe ? `mock-refresh-token-${Date.now()}` : undefined,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        user: data.login
      };
      
      // Update tokens in GraphQL client
      this.graphqlClient.setAuthToken(authResponse.token);
      
      if (authResponse.refreshToken) {
        this.graphqlClient.setRefreshToken(authResponse.refreshToken);
      }
      
      return authResponse;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Logout from the Vendure Admin API
   * @returns Promise resolving to void
   */
  async logout(): Promise<void> {
    if (this.graphqlClient.isAuthenticated()) {
      try {
        await this.graphqlClient.mutate(LOGOUT_MUTATION);
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    this.graphqlClient.setAuthToken('');
    this.graphqlClient.setRefreshToken('');
  }

  /**
   * Get the current authenticated user
   * @returns Promise resolving to current user
   */
  async getCurrentUser(): Promise<CurrentUser> {
    const result = await this.graphqlClient.query<{ me: CurrentUser }>(GET_CURRENT_USER);
    return result.me;
  }
}
