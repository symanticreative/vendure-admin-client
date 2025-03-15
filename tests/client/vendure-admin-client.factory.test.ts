import { VendureAdminClientFactory } from '../../src/client/vendure-admin-client.factory';
import { VendureAdminClient } from '../../src/client/vendure-admin-client';
import { VendureAdminClientConfig } from '../../src/core/config/client-config';

// Mock VendureAdminClient
jest.mock('../../src/client/vendure-admin-client');

describe('VendureAdminClientFactory', () => {
  const config: VendureAdminClientConfig = {
    apiUrl: 'https://test-api.vendure.io/admin-api'
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createClient', () => {
    it('should create a new VendureAdminClient instance', () => {
      const result = VendureAdminClientFactory.createClient(config);
      
      expect(VendureAdminClient).toHaveBeenCalledWith(config);
      expect(result).toBeInstanceOf(VendureAdminClient);
    });
    
    it('should pass configuration to client constructor', () => {
      const extendedConfig: VendureAdminClientConfig = {
        ...config,
        authToken: 'test-token',
        refreshToken: 'test-refresh-token',
        timeout: 30000
      };
      
      VendureAdminClientFactory.createClient(extendedConfig);
      
      expect(VendureAdminClient).toHaveBeenCalledWith(extendedConfig);
    });
  });
});
