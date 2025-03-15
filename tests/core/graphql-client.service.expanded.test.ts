import { GraphQLClientService } from '../../src/core/graphql/graphql-client.service';
import { VendureAdminClientConfig } from '../../src/core/config/client-config';
import { gql, DocumentNode, FetchPolicy } from '@apollo/client';

// Mock Apollo client and context
jest.mock('@apollo/client', () => {
  const originalModule = jest.requireActual('@apollo/client');
  return {
    ...originalModule,
    ApolloClient: jest.fn().mockImplementation(() => ({
      query: jest.fn().mockResolvedValue({ data: { mockQueryData: true } }),
      mutate: jest.fn().mockResolvedValue({ data: { mockMutationData: true } }),
      defaultOptions: {},
    })),
    createHttpLink: jest.fn().mockReturnValue('mockHttpLink'),
    from: jest.fn(links => links),
    InMemoryCache: jest.fn().mockImplementation(() => 'mockCache'),
    gql: jest.fn(query => `Parsed query: ${query}` as unknown as DocumentNode),
  };
});

jest.mock('@apollo/client/link/context', () => ({
  setContext: jest.fn().mockImplementation(fn => {
    fn(null, { headers: {} });
    return 'mockAuthLink';
  }),
}));

jest.mock('cross-fetch', () => 'mockFetch');

describe('GraphQLClientService', () => {
  let graphQLClient: GraphQLClientService;
  let mockApolloClient: any;
  
  const config: VendureAdminClientConfig = {
    apiUrl: 'https://test-api.vendure.io/admin-api',
    authToken: 'initial-token',
    refreshToken: 'initial-refresh-token',
    timeout: 5000
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockApolloClient = {
      query: jest.fn().mockResolvedValue({ data: { mockQueryData: true } }),
      mutate: jest.fn().mockResolvedValue({ data: { mockMutationData: true } }),
      defaultOptions: {}
    };
    
    // @ts-ignore - mock implementation
    graphQLClient = new GraphQLClientService(config);
    // @ts-ignore - adding mock client
    graphQLClient.client = mockApolloClient;
  });

  describe('constructor', () => {
    it('should initialize with default timeout if not provided', () => {
      const minimalConfig: VendureAdminClientConfig = {
        apiUrl: 'https://test-api.vendure.io/admin-api'
      };
      
      const service = new GraphQLClientService(minimalConfig);
      
      // @ts-ignore - accessing private property
      expect(service.config.timeout).toBe(10000);
    });
  });

  describe('query', () => {
    it('should execute a GraphQL query string', async () => {
      const mockQueryString = 'query { test }';
      const mockVariables = { id: '123' };
      
      const result = await graphQLClient.query(mockQueryString, mockVariables);
      
      expect(gql).toHaveBeenCalledWith(mockQueryString);
      expect(mockApolloClient.query).toHaveBeenCalled();
      expect(result).toEqual({ mockQueryData: true });
    });

    it('should handle query errors', async () => {
      const mockQueryString = 'query { test }';
      const errorMessage = 'Query failed';
      
      mockApolloClient.query.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(graphQLClient.query(mockQueryString)).rejects.toThrow(errorMessage);
    });
  });

  describe('mutate', () => {
    it('should execute a GraphQL mutation string', async () => {
      const mockMutationString = 'mutation { createTest(input: {}) { id } }';
      const mockVariables = { input: { name: 'Test' } };
      
      const result = await graphQLClient.mutate(mockMutationString, mockVariables);
      
      expect(gql).toHaveBeenCalledWith(mockMutationString);
      expect(mockApolloClient.mutate).toHaveBeenCalled();
      expect(result).toEqual({ mockMutationData: true });
    });

    it('should handle mutation errors', async () => {
      const mockMutationString = 'mutation { test }';
      const errorMessage = 'Mutation failed';
      
      mockApolloClient.mutate.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(graphQLClient.mutate(mockMutationString)).rejects.toThrow(errorMessage);
    });
  });

  describe('executeOperation', () => {
    it('should execute a GraphQL query operation', async () => {
      const mockQueryString = 'query { test }';
      const mockVariables = { id: '123' };
      const options = { type: 'query' as const, fetchPolicy: 'no-cache' as FetchPolicy };
      
      await graphQLClient.executeOperation(mockQueryString, mockVariables, options);
      
      expect(gql).toHaveBeenCalledWith(mockQueryString);
      expect(mockApolloClient.query).toHaveBeenCalledWith({
        query: gql(mockQueryString),
        variables: mockVariables,
        fetchPolicy: 'no-cache'
      });
    });

    it('should execute a GraphQL mutation operation', async () => {
      const mockMutationString = 'mutation { test }';
      const mockVariables = { input: { name: 'Test' } };
      const options = { type: 'mutation' as const };
      
      await graphQLClient.executeOperation(mockMutationString, mockVariables, options);
      
      expect(gql).toHaveBeenCalledWith(mockMutationString);
      expect(mockApolloClient.mutate).toHaveBeenCalledWith({
        mutation: gql(mockMutationString),
        variables: mockVariables
      });
    });

    it('should default to query type if not specified', async () => {
      const mockQueryString = 'query { test }';
      
      await graphQLClient.executeOperation(mockQueryString);
      
      expect(mockApolloClient.query).toHaveBeenCalled();
      expect(mockApolloClient.mutate).not.toHaveBeenCalled();
    });

    it('should use default fetchPolicy for queries', async () => {
      const mockQueryString = 'query { test }';
      
      await graphQLClient.executeOperation(mockQueryString);
      
      expect(mockApolloClient.query).toHaveBeenCalledWith(
        expect.objectContaining({
          fetchPolicy: 'network-only'
        })
      );
    });

    it('should handle operation errors', async () => {
      const mockOperationString = 'query { test }';
      const errorMessage = 'Operation failed';
      
      mockApolloClient.query.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(graphQLClient.executeOperation(mockOperationString)).rejects.toThrow(errorMessage);
    });
  });

  describe('updateConfig', () => {
    it('should update config values', () => {
      const newConfig: Partial<VendureAdminClientConfig> = {
        timeout: 20000,
        authToken: 'updated-token',
        refreshToken: 'updated-refresh-token'
      };
      
      graphQLClient.updateConfig(newConfig);
      
      // @ts-ignore - accessing private property
      expect(graphQLClient.config.timeout).toBe(20000);
      expect(graphQLClient.getAuthToken()).toBe('updated-token');
      expect(graphQLClient.getRefreshToken()).toBe('updated-refresh-token');
    });

    it('should recreate Apollo client when API URL changes', () => {
      const createApolloClientSpy = jest.spyOn(graphQLClient as any, 'createApolloClient');
      
      graphQLClient.updateConfig({ apiUrl: 'https://new-api.vendure.io/admin-api' });
      
      expect(createApolloClientSpy).toHaveBeenCalled();
    });

    it('should not recreate Apollo client when other config changes', () => {
      const createApolloClientSpy = jest.spyOn(graphQLClient as any, 'createApolloClient');
      
      graphQLClient.updateConfig({ timeout: 30000 });
      
      expect(createApolloClientSpy).not.toHaveBeenCalled();
    });
  });

  describe('token management', () => {
    it('should get and set auth token', () => {
      const newToken = 'new-auth-token';
      
      graphQLClient.setAuthToken(newToken);
      
      expect(graphQLClient.getAuthToken()).toBe(newToken);
    });

    it('should get and set refresh token', () => {
      const newToken = 'new-refresh-token';
      
      graphQLClient.setRefreshToken(newToken);
      
      expect(graphQLClient.getRefreshToken()).toBe(newToken);
    });

    it('should check if authenticated', () => {
      expect(graphQLClient.isAuthenticated()).toBe(true);
      
      graphQLClient.setAuthToken('');
      
      expect(graphQLClient.isAuthenticated()).toBe(false);
    });
  });

  describe('getApolloClient', () => {
    it('should return the Apollo client instance', () => {
      const client = graphQLClient.getApolloClient();
      
      expect(client).toBe(mockApolloClient);
    });
  });
});
