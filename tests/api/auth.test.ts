import { loginAdmin, logoutAdmin, getCurrentUser } from '../../src/api/auth';
import { VendureAdminClient } from '../../src/client/vendure-admin-client';

// Mock the VendureAdminClient class
jest.mock('../../src/client/vendure-admin-client');

describe('Auth API', () => {
  const mockApiUrl = 'https://test-api.vendure.io/admin-api';
  const mockCredentials = {
    email: 'admin@example.com',
    password: 'admin123'
  };
  
  let mockClient: any;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockClient = {
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
    
    // Set up mock for VendureAdminClient singleton
    (VendureAdminClient.getInstance as jest.Mock).mockReturnValue(mockClient);
  });

  it('should initialize client instance and login successfully', async () => {
    const result = await loginAdmin(mockCredentials);
    
    expect(result.token).toBe('mock-token');
    expect(result.expires).toBeDefined();
    expect(mockClient.login).toHaveBeenCalledWith(
      mockCredentials.email,
      mockCredentials.password,
      false
    );
  });

  it('should logout successfully', async () => {
    await logoutAdmin();
    
    expect(mockClient.logout).toHaveBeenCalled();
  });

  it('should get current user', async () => {
    const user = await getCurrentUser();
    
    expect(user.id).toBe('user-1');
    expect(user.identifier).toBe('admin@example.com');
    expect(mockClient.query).toHaveBeenCalled();
  });

  it('should throw error when client not initialized', async () => {
    // Make getInstance throw an error
    (VendureAdminClient.getInstance as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Vendure Admin Client not initialized');
    });
    
    await expect(loginAdmin(mockCredentials)).rejects.toThrow(
      'Vendure Admin Client not initialized'
    );
  });
});
