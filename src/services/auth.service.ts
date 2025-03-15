import { Injectable } from '../core/di/injectable.decorator';
import { AuthRepository } from '../repositories/auth.repository';
import { AuthCredentials, AuthResponse, CurrentUser } from '../models/auth.model';

/**
 * Service for authentication operations
 */
@Injectable()
export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  /**
   * Login to the Vendure Admin API
   * @param credentials - Authentication credentials
   * @returns Promise resolving to auth response
   */
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    return this.authRepository.login(credentials);
  }

  /**
   * Logout from the Vendure Admin API
   * @returns Promise resolving to void
   */
  async logout(): Promise<void> {
    return this.authRepository.logout();
  }

  /**
   * Get the current authenticated user
   * @returns Promise resolving to current user
   */
  async getCurrentUser(): Promise<CurrentUser> {
    return this.authRepository.getCurrentUser();
  }

  /**
   * Check if the user is authenticated
   * @returns Boolean indicating if authenticated
   */
  isAuthenticated(): boolean {
    // This would typically check token validity, expiration, etc.
    // For now, we'll just return a placeholder
    return true; // Placeholder
  }
}
