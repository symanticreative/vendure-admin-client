import { AuthRepository } from '../../src/repositories/auth.repository';
import { GraphQLClientService } from '../../src/core/graphql/graphql-client.service';
import { AuthCredentials, CurrentUser } from '../../src/models/auth.model';
import { LOGIN_MUTATION, LOGOUT_MUTATION, GET_CURRENT_USER } from '../../src/graphql/auth.queries';
import { gql } from '@apollo/client';

// Mock the GraphQLClientService
jest.mock('../../src/core/graphql/graphql-client.service');
jest.mock('@apollo/client', () => ({
  gql: jest.fn(query => `Parsed query: ${query}`)
}));

describe('AuthRepository', () => {
  let authRepository: AuthRepository;
  let mockGraphQLClient: jest.Mocked<GraphQLClientService>;
  
  const mockApolloClient = {
    query: jest.fn(),
    mutate: jest.fn()
  };
  
  const mockCredentials: AuthCredentials = {
    email: 'admin@example.com',
    password: 'password123',
    rememberMe: true
  };
  
  const mockLoginResponse = {
    data: {
      login: {
        id: 'user-1',
        identifier: 'admin@example.com'
      }
    }
  };
  
  const mockCurrentUser: CurrentUser = {
    id: 'user-1',
    identifier: 'admin@example.com',
    channels: [
      { id: 'channel-1', code: 'default', token: 'channel-token' }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create a mock GraphQLClient
    mockGraphQLClient = {
      query: jest.fn().mockResolvedValue({ me: mockCurrentUser }),
      mutate: jest.fn().mockResolvedValue({}),
      getApolloClient: jest.fn().mockReturnValue(mockApolloClient),
      setAuthToken: jest.fn(),
      setRefreshToken: jest.fn(),
      isAuthenticated: jest.fn().mockReturnValue(true)
    } as unknown as jest.Mocked<GraphQLClientService>;
    
    // Set up the Apollo client mock for login
    mockApolloClient.mutate.mockResolvedValueOnce(mockLoginResponse);
    
    // Initialize repository with mock client
    authRepository = new AuthRepository(mockGraphQLClient);
  });

  describe('login', () => {
    it('should execute login mutation and return auth response', async () => {
      const result = await authRepository.login(mockCredentials);
      
      // Check GraphQL client calls
      expect(mockGraphQLClient.getApolloClient).toHaveBeenCalled();
      expect(mockApolloClient.mutate).toHaveBeenCalledWith({
        mutation: gql(LOGIN_MUTATION),
        variables: {
          username: mockCredentials.email,
          password: mockCredentials.password,
          rememberMe: mockCredentials.rememberMe
        }
      });
      
      // Check returned response
      expect(result.token).toContain('mock-token-');
      expect(result.refreshToken).toContain('mock-refresh-token-');
      expect(result.user).toEqual(mockLoginResponse.data.login);
      
      // Verify tokens were set on the client
      expect(mockGraphQLClient.setAuthToken).toHaveBeenCalledWith(result.token);
      expect(mockGraphQLClient.setRefreshToken).toHaveBeenCalledWith(result.refreshToken);
    });
    
    it('should throw an error when login fails', async () => {
      // Mock error response
      mockApolloClient.mutate.mockReset();
      mockApolloClient.mutate.mockResolvedValueOnce({
        data: {
          login: {
            errorCode: 'INVALID_CREDENTIALS',
            message: 'Invalid credentials'
          }
        }
      });
      
      await expect(authRepository.login(mockCredentials)).rejects.toThrow('Login failed: Invalid credentials');
    });
    
    it('should handle API errors', async () => {
      // Mock a network error
      mockApolloClient.mutate.mockReset();
      mockApolloClient.mutate.mockRejectedValueOnce(new Error('Network error'));
      
      await expect(authRepository.login(mockCredentials)).rejects.toThrow('Network error');
    });
  });

  describe('logout', () => {
    it('should execute logout mutation and clear tokens when authenticated', async () => {
      await authRepository.logout();
      
      expect(mockGraphQLClient.isAuthenticated).toHaveBeenCalled();
      expect(mockGraphQLClient.mutate).toHaveBeenCalledWith(LOGOUT_MUTATION);
      expect(mockGraphQLClient.setAuthToken).toHaveBeenCalledWith('');
      expect(mockGraphQLClient.setRefreshToken).toHaveBeenCalledWith('');
    });
    
    it('should just clear tokens when not authenticated', async () => {
      mockGraphQLClient.isAuthenticated.mockReturnValueOnce(false);
      
      await authRepository.logout();
      
      expect(mockGraphQLClient.mutate).not.toHaveBeenCalled();
      expect(mockGraphQLClient.setAuthToken).toHaveBeenCalledWith('');
      expect(mockGraphQLClient.setRefreshToken).toHaveBeenCalledWith('');
    });
    
    it('should handle logout errors gracefully', async () => {
      mockGraphQLClient.mutate.mockRejectedValueOnce(new Error('Logout error'));
      
      // Should not throw
      await authRepository.logout();
      
      // Should still clear tokens
      expect(mockGraphQLClient.setAuthToken).toHaveBeenCalledWith('');
      expect(mockGraphQLClient.setRefreshToken).toHaveBeenCalledWith('');
    });
  });

  describe('getCurrentUser', () => {
    it('should execute getCurrentUser query and return the user', async () => {
      const result = await authRepository.getCurrentUser();
      
      expect(mockGraphQLClient.query).toHaveBeenCalledWith(GET_CURRENT_USER);
      expect(result).toEqual(mockCurrentUser);
    });
  });
});
