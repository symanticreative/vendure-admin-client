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
   * Refresh token for the Vendure Admin API
   */
  refreshToken?: string;
  
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
  refreshToken?: string;
  expires: string;
  user?: CurrentUser;
}

/**
 * Current admin user information
 */
export interface CurrentUser {
  id: string;
  identifier: string;
  channels?: Channel[];
}

/**
 * Channel information
 */
export interface Channel {
  id: string;
  code: string;
  token: string;
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

/**
 * Sort order for query results
 */
export type SortOrder = 'ASC' | 'DESC';

/**
 * Query options for paginated requests
 */
export interface ListQueryOptions {
  take?: number;
  skip?: number;
  sort?: {
    [key: string]: SortOrder;
  };
  filter?: {
    [key: string]: any;
  };
}

/**
 * Product interface
 */
export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  enabled: boolean;
  [key: string]: any;
}

/**
 * Order interface
 */
export interface Order {
  id: string;
  code: string;
  state: string;
  total: number;
  currencyCode: string;
  [key: string]: any;
}

/**
 * Customer interface
 */
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  [key: string]: any;
}

/**
 * Admin settings interface
 */
export interface AdminSettings {
  id: string;
  currency: string;
  defaultLanguage: string;
  [key: string]: any;
}
