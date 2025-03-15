import { setAdminCredentials, loginAdmin, logoutAdmin, getCurrentUser } from '../../src/api/auth';
import { VendureAdminClient } from '../../src/client/vendure-admin-client';

// Mock the VendureAdminClient class
jest.mock('../../src/client/vendure-admin-client');

describe('Auth API', () => {
  const mockApiUrl = 'https://test-api.vendure.io/admin-api';
  const mockCredentials = {
    email: 'admin@example.com',
    password: 'admin123'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set up mock for VendureAdminClient
    (VendureAdminClient as jest.Mock).mockImplementation(() => ({
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
    }));
  });

  it('should set admin credentials and create client instance', () => {
    setAdminCredentials({ apiUrl: mockApiUrl });
    
    expect(VendureAdminClient).toHaveBeenCalledWith({
      apiUrl: mockApiUrl
    });
  });

  it('should login successfully', async () => {
    setAdminCredentials({ apiUrl: mockApiUrl });
    
    const result = await loginAdmin(mockCredentials);
    
    expect(result.token).toBe('mock-token');
    expect(result.expires).toBeDefined();
  });

  it('should logout successfully', async () => {
    setAdminCredentials({ apiUrl: mockApiUrl });
    
    await logoutAdmin();
    
    const mockClient = (VendureAdminClient as jest.Mock).mock.results[0].value;
    expect(mockClient.logout).toHaveBeenCalled();
  });

  it('should get current user', async () => {
    setAdminCredentials({ apiUrl: mockApiUrl });
    
    const user = await getCurrentUser();
    
    expect(user.id).toBe('user-1');
    expect(user.identifier).toBe('admin@example.com');
    
    const mockClient = (VendureAdminClient as jest.Mock).mock.results[0].value;
    expect(mockClient.query).toHaveBeenCalled();
  });

  it('should throw error when credentials not set', async () => {
    // Reset global client
    (global as any).globalClient = null;
    
    await expect(loginAdmin(mockCredentials)).rejects.toThrow(
      'Admin credentials not set'
    );
  });
});
