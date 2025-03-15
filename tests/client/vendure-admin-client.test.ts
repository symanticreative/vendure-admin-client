import { VendureAdminClient } from '../../src/client/vendure-admin-client';
import { VendureAdminClientConfig } from '../../src/core/config/client-config';
import { GraphQLClientService } from '../../src/core/graphql/graphql-client.service';
import { Container } from '../../src/core/di/container';
import { AuthService } from '../../src/services/auth.service';
import { ProductService } from '../../src/services/product.service';
import { OrderService } from '../../src/services/order.service';
import { CustomerService } from '../../src/services/customer.service';
import { SettingsService } from '../../src/services/settings.service';

// Mock GraphQLClientService and services
jest.mock('../../src/core/graphql/graphql-client.service');
jest.mock('../../src/services/auth.service');
jest.mock('../../src/services/product.service');
jest.mock('../../src/services/order.service');
jest.mock('../../src/services/customer.service');
jest.mock('../../src/services/settings.service');

// Mock repositories
jest.mock('../../src/repositories/auth.repository');
jest.mock('../../src/repositories/product.repository');
jest.mock('../../src/repositories/order.repository');
jest.mock('../../src/repositories/customer.repository');
jest.mock('../../src/repositories/settings.repository');

describe('VendureAdminClient', () => {
  // Reset container before tests
  beforeAll(() => {
    Container.getInstance().clear();
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  const config: VendureAdminClientConfig = {
    apiUrl: 'https://test-api.vendure.io/admin-api',
    authToken: 'test-token',
    refreshToken: 'test-refresh-token'
  };

  describe('constructor', () => {
    it('should initialize all services and repositories', () => {
      const client = new VendureAdminClient(config);
      
      // Verify GraphQL client was initialized
      expect(GraphQLClientService).toHaveBeenCalledWith(config);
      
      // Verify all services were instantiated
      expect(AuthService).toHaveBeenCalled();
      expect(ProductService).toHaveBeenCalled();
      expect(OrderService).toHaveBeenCalled();
      expect(CustomerService).toHaveBeenCalled();
      expect(SettingsService).toHaveBeenCalled();
      
      // Verify services are exposed as properties
      expect(client.auth).toBeInstanceOf(AuthService);
      expect(client.products).toBeInstanceOf(ProductService);
      expect(client.orders).toBeInstanceOf(OrderService);
      expect(client.customers).toBeInstanceOf(CustomerService);
      expect(client.settings).toBeInstanceOf(SettingsService);
    });
  });

  describe('service access', () => {
    it('should provide access to services', () => {
      const client = new VendureAdminClient(config);
      
      // All services should be accessible
      expect(client.auth).toBeDefined();
      expect(client.products).toBeDefined();
      expect(client.orders).toBeDefined();
      expect(client.customers).toBeDefined();
      expect(client.settings).toBeDefined();
    });
  });
});
