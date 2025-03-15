import { loginAdmin, logoutAdmin, getCurrentUser } from '../../src/api/auth';
import { VendureAdminClient } from '../../src/client/vendure-admin-client';

// Mock the VendureAdminClient class
jest.mock('../../src/client/vendure-admin-client', () => {
  const mockInstance = {
    login: jest.fn().mockResolvedValue({
      token: 'mock-token',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }),
    logout: jest.fn().mockResolvedValue(undefined),
    query: jest.fn().mockResolvedValue({
      me: {
        id: 'user-1',
        identifier: 'admin@example.com'
      }
    })
  };
  
  return {
    VendureAdminClient: {
      getInstance: jest.fn().mockReturnValue(mockInstance)
    }
  };
});

describe('Auth API', () => {
  const mockCredentials = {
    email: 'admin@example.com',
    password: 'admin123'
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should login successfully', async () => {
    const result = await loginAdmin(mockCredentials);
    
    expect(result.token).toBe('mock-token');
    expect(result.expires).toBeDefined();
    
    const mockClient = VendureAdminClient.getInstance();
    expect(mockClient.login).toHaveBeenCalledWith(
      mockCredentials.email,
      mockCredentials.password,
      false
    );
  });

  it('should logout successfully', async () => {
    await logoutAdmin();
    
    const mockClient = VendureAdminClient.getInstance();
    expect(mockClient.logout).toHaveBeenCalled();
  });

  it('should get current user', async () => {
    const user = await getCurrentUser();
    
    expect(user.id).toBe('user-1');
    expect(user.identifier).toBe('admin@example.com');
    
    const mockClient = VendureAdminClient.getInstance();
    expect(mockClient.query).toHaveBeenCalled();
  });

  it('should throw error when client not initialized', async () => {
    // Override the mock implementation for this test only
    const originalGetInstance = VendureAdminClient.getInstance;
    VendureAdminClient.getInstance = jest.fn().mockImplementationOnce(() => {
      throw new Error('Vendure Admin Client not initialized');
    });
    
    await expect(loginAdmin(mockCredentials)).rejects.toThrow(
      'Vendure Admin Client not initialized'
    );
    
    // Restore original mock
    VendureAdminClient.getInstance = originalGetInstance;
  });
});
