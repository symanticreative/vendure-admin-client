import { VendureAdminClient } from '../src/client/vendure-admin-client';
import { createApolloClient } from '../src/client/apollo-client';

// Mock apollo client creation
jest.mock('../src/client/apollo-client', () => ({
  createApolloClient: jest.fn().mockReturnValue({
    query: jest.fn(),
    mutate: jest.fn()
  })
}));

describe('VendureAdminClient', () => {
  const apiUrl = 'https://test-api.vendure.io/admin-api';
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the singleton instance before each test
    VendureAdminClient['resetInstance']();
  });

  describe('getInstance', () => {
    it('should create a new instance when first called with config', () => {
      const client = VendureAdminClient.getInstance({ apiUrl });
      
      expect(client).toBeInstanceOf(Object);
      expect(createApolloClient).toHaveBeenCalledWith(apiUrl, expect.any(Function));
    });

    it('should throw error when called without config and no instance exists', () => {
      expect(() => {
        VendureAdminClient.getInstance();
      }).toThrow('VendureAdminClient must be initialized with configuration first');
    });

    it('should return the same instance on subsequent calls', () => {
      const client1 = VendureAdminClient.getInstance({ apiUrl });
      const client2 = VendureAdminClient.getInstance();
      
      expect(client1).toBe(client2);
      // Apollo client should only be created once
      expect(createApolloClient).toHaveBeenCalledTimes(1);
    });

    it('should update config if provided to subsequent getInstance calls', () => {
      // First initialization
      const client1 = VendureAdminClient.getInstance({ apiUrl });
      
      // Update with auth token
      const client2 = VendureAdminClient.getInstance({ 
        apiUrl,
        authToken: 'test-token' 
      });
      
      expect(client1).toBe(client2);
      expect(client2.getAuthToken()).toBe('test-token');
      // Apollo client should still only be created once
      expect(createApolloClient).toHaveBeenCalledTimes(1);
    });
    
    it('should recreate Apollo client when API URL changes', () => {
      // First initialization
      VendureAdminClient.getInstance({ apiUrl });
      
      // Change API URL
      const newApiUrl = 'https://new-api.vendure.io/admin-api';
      VendureAdminClient.getInstance({ apiUrl: newApiUrl });
      
      // Apollo client should be created twice
      expect(createApolloClient).toHaveBeenCalledTimes(2);
      expect(createApolloClient).toHaveBeenLastCalledWith(newApiUrl, expect.any(Function));
    });
  });

  describe('authentication methods', () => {
    it('should get/set auth token', () => {
      const client = VendureAdminClient.getInstance({ apiUrl });
      
      expect(client.getAuthToken()).toBeNull();
      
      client.setAuthToken('test-token');
      expect(client.getAuthToken()).toBe('test-token');
    });
    
    it('should get/set refresh token', () => {
      const client = VendureAdminClient.getInstance({ apiUrl });
      
      expect(client.getRefreshToken()).toBeNull();
      
      client.setRefreshToken('test-refresh-token');
      expect(client.getRefreshToken()).toBe('test-refresh-token');
    });
    
    it('should check if authenticated', () => {
      const client = VendureAdminClient.getInstance({ apiUrl });
      
      expect(client.isAuthenticated()).toBe(false);
      
      client.setAuthToken('test-token');
      expect(client.isAuthenticated()).toBe(true);
    });
  });

  // Add tests for login, logout, query, mutate, executeCustomOperation methods as needed
});
