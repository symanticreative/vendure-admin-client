/**
 * Configuration options for the Vendure Admin client
 */
export interface VendureAdminClientConfig {
  /**
   * The URL of the Vendure Admin API
   */
  apiUrl: string;
  
  /**
   * Authentication token for the Vendure Admin API
   */
  authToken?: string;
  
  /**
   * Timeout in milliseconds for API requests
   * @default 10000
   */
  timeout?: number;
}

/**
 * Response structure for authentication requests
 */
export interface AuthResponse {
  token: string;
  expires: string;
}

/**
 * Error response from the Vendure API
 */
export interface VendureApiError {
  message: string;
  code?: string;
  path?: string[];
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  perPage: number;
}
