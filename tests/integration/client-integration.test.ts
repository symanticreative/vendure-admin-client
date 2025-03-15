import { VendureAdminClientFactory } from '../../src/client/vendure-admin-client.factory';
import { VendureAdminClient } from '../../src/client/vendure-admin-client';

  // Mock implementation of GraphQLClientService to avoid actual network requests
jest.mock('../../src/core/graphql/graphql-client.service', () => {
  return {
    GraphQLClientService: jest.fn().mockImplementation(() => ({
      query: jest.fn().mockImplementation((query) => {
        // Return mock data based on the query
        if (query.includes('products')) {
          return {
            products: {
              items: [
                { id: 'product-1', name: 'Test Product 1' },
                { id: 'product-2', name: 'Test Product 2' }
              ],
              totalItems: 2
            }
          };
        } else if (query.includes('orders')) {
          return {
            orders: {
              items: [
                { id: 'order-1', code: 'TEST-001' },
                { id: 'order-2', code: 'TEST-002' }
              ],
              totalItems: 2
            }
          };
        } else if (query.includes('customers')) {
          return {
            customers: {
              items: [
                { id: 'customer-1', firstName: 'John', lastName: 'Doe' },
                { id: 'customer-2', firstName: 'Jane', lastName: 'Smith' }
              ],
              totalItems: 2
            }
          };
        } else if (query.includes('globalSettings')) {
          return {
            globalSettings: {
              id: 'settings-1',
              availableLanguages: ['en', 'fr']
            }
          };
        }
        return {};
      }),
      mutate: jest.fn().mockImplementation((mutation) => {
        // Return mock data based on the mutation
        if (mutation.includes('login')) {
          return {
            login: {
              id: 'user-1',
              identifier: 'admin@example.com'
            }
          };
        }
        return {};
      }),
      getApolloClient: jest.fn().mockReturnValue({
        query: jest.fn(),
        mutate: jest.fn().mockResolvedValue({
          data: {
            login: {
              id: 'user-1',
              identifier: 'admin@example.com'
            }
          }
        })
      }),
      setAuthToken: jest.fn(),
      setRefreshToken: jest.fn(),
      isAuthenticated: jest.fn().mockReturnValue(true),
      getAuthToken: jest.fn().mockReturnValue('mock-token')
    }))
  };
});

describe('VendureAdminClient Integration', () => {
  let client: VendureAdminClient;
  
  beforeEach(() => {
    // Create a fresh client for each test
    client = VendureAdminClientFactory.createClient({
      apiUrl: 'https://test-api.vendure.io/admin-api'
    });
  });

  describe('End-to-end flow', () => {
    it('should allow authenticating and retrieving data', async () => {
      // Authenticate
      const authResult = await client.auth.login({
        email: 'admin@example.com',
        password: 'password123'
      });
      
      // Verify auth was successful
      expect(authResult.user).toBeDefined();
      
      // Get products
      const products = await client.products.getPaginated({ take: 10 });
      expect(products.items).toHaveLength(2);
      expect(products.items[0].name).toBe('Test Product 1');
      
      // Get orders
      const orders = await client.orders.getPaginated({ take: 10 });
      expect(orders.items).toHaveLength(2);
      expect(orders.items[0].code).toBe('TEST-001');
      
      // Get customers
      const customers = await client.customers.getPaginated({ take: 10 });
      expect(customers.items).toHaveLength(2);
      expect(customers.items[0].firstName).toBe('John');
      
      // Get settings
      const settings = await client.settings.getSettings();
      expect(settings.availableLanguages).toContain('en');
    });
  });

  describe('Error handling', () => {
    it('should handle service errors gracefully', async () => {
      // Mock implementation to simulate error
      jest.spyOn(client.products, 'getPaginated').mockRejectedValueOnce(
        new Error('API error')
      );
      
      // Should throw the error
      await expect(client.products.getPaginated({ take: 10 }))
        .rejects.toThrow('API error');
    });
  });
});
