import { VendureAdminClient } from './vendure-admin-client';
import { VendureAdminClientConfig } from '../core/config/client-config';

/**
 * Factory for creating VendureAdminClient instances
 * Provides a clean way to instantiate the client
 */
export class VendureAdminClientFactory {
  /**
   * Create a new instance of VendureAdminClient
   * @param config - Client configuration
   * @returns New VendureAdminClient instance
   */
  public static createClient(config: VendureAdminClientConfig): VendureAdminClient {
    return new VendureAdminClient(config);
  }
}
