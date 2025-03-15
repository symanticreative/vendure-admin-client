import { AuthService } from '../../src/services/auth.service';
import { AuthRepository } from '../../src/repositories/auth.repository';
import { AuthCredentials, AuthResponse, CurrentUser } from '../../src/models/auth.model';

// Mock the AuthRepository
jest.mock('../../src/repositories/auth.repository');

describe('AuthService', () => {
  let authService: AuthService;
  let mockAuthRepository: jest.Mocked<AuthRepository>;

  const mockCredentials: AuthCredentials = {
    email: 'admin@example.com',
    password: 'password123',
    rememberMe: true
  };

  const mockAuthResponse: AuthResponse = {
    token: 'mock-token',
    refreshToken: 'mock-refresh-token',
    expires: new Date().toISOString(),
    user: {
      id: 'user-1',
      identifier: 'admin@example.com'
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
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Create a fresh mock repository
    mockAuthRepository = {
      login: jest.fn().mockResolvedValue(mockAuthResponse),
      logout: jest.fn().mockResolvedValue(undefined),
      getCurrentUser: jest.fn().mockResolvedValue(mockCurrentUser)
    } as unknown as jest.Mocked<AuthRepository>;
    
    // Initialize the service with the mock repository
    authService = new AuthService(mockAuthRepository);
  });

  describe('login', () => {
    it('should call repository login with provided credentials', async () => {
      const result = await authService.login(mockCredentials);
      
      expect(mockAuthRepository.login).toHaveBeenCalledWith(mockCredentials);
      expect(result).toEqual(mockAuthResponse);
    });

    it('should handle login errors', async () => {
      const errorMessage = 'Invalid credentials';
      mockAuthRepository.login.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(authService.login(mockCredentials)).rejects.toThrow(errorMessage);
    });
  });

  describe('logout', () => {
    it('should call repository logout', async () => {
      await authService.logout();
      
      expect(mockAuthRepository.logout).toHaveBeenCalled();
    });
  });

  describe('getCurrentUser', () => {
    it('should call repository getCurrentUser and return result', async () => {
      const result = await authService.getCurrentUser();
      
      expect(mockAuthRepository.getCurrentUser).toHaveBeenCalled();
      expect(result).toEqual(mockCurrentUser);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true indicating authentication status', () => {
      const result = authService.isAuthenticated();
      
      // This is hardcoded to true for now in the implementation
      expect(result).toBe(true);
    });
  });
});
