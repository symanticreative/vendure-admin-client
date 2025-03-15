import { Injectable } from '../core/di/injectable.decorator';
import { GraphQLClientService } from '../core/graphql/graphql-client.service';
import { AdminSettings, UpdateAdminSettingsInput } from '../models/settings.model';
import { GET_ADMIN_SETTINGS, UPDATE_ADMIN_SETTINGS } from '../graphql/settings.queries';

/**
 * Repository for admin settings operations
 * Note: Settings are handled differently from other entities,
 * so we don't extend the base repository
 */
@Injectable()
export class SettingsRepository {
  constructor(private graphqlClient: GraphQLClientService) {}

  /**
   * Get admin settings
   * @returns Promise resolving to admin settings
   */
  async getSettings(): Promise<AdminSettings> {
    const result = await this.graphqlClient.query<{
      globalSettings: AdminSettings;
    }>(GET_ADMIN_SETTINGS);
    
    return result.globalSettings;
  }

  /**
   * Update admin settings
   * @param input - Settings update input
   * @returns Promise resolving to updated settings
   */
  async updateSettings(input: UpdateAdminSettingsInput): Promise<AdminSettings> {
    const result = await this.graphqlClient.mutate<{
      updateGlobalSettings: AdminSettings;
    }>(UPDATE_ADMIN_SETTINGS, { input });
    
    return result.updateGlobalSettings;
  }
}
