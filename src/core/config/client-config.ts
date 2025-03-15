/**
 * Configuration interface for the Vendure Admin Client
 */
export interface VendureAdminClientConfig {
  /**
   * The URL of the Vendure Admin API
   */
  apiUrl: string;
  
  /**
   * Authentication token for the Vendure Admin API (optional)
   */
  authToken?: string;
  
  /**
   * Refresh token for the Vendure Admin API (optional)
   */
  refreshToken?: string;
  
  /**
   * Timeout in milliseconds for API requests (optional)
   * @default 10000
   */
  timeout?: number;
}

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: Partial<VendureAdminClientConfig> = {
  timeout: 10000
};
