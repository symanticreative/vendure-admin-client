/**
 * Authentication credentials interface
 */
export interface AuthCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Authentication response interface
 */
export interface AuthResponse {
  token: string;
  refreshToken?: string;
  expires: string;
  user?: CurrentUser;
}

/**
 * Current user interface
 */
export interface CurrentUser {
  id: string;
  identifier: string;
  channels?: Channel[];
}

/**
 * Channel interface
 */
export interface Channel {
  id: string;
  code: string;
  token: string;
}
