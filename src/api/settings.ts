import { getClient } from './auth';
import { AdminSettings } from '../types';
import { 
  GET_ADMIN_SETTINGS, 
  UPDATE_ADMIN_SETTINGS
} from '../graphql/settings';

/**
 * Get current admin settings
 * 
 * @returns Promise resolving to the admin settings
 */
export async function getAdminSettings(): Promise<AdminSettings> {
  const client = getClient();
  const result = await client.query<{
    globalSettings: AdminSettings;
  }>(GET_ADMIN_SETTINGS);
  
  return result.globalSettings;
}

/**
 * Update admin settings
 * 
 * @param input - Settings update input
 * @returns Promise resolving to the updated settings
 */
export async function updateAdminSettings(
  input: Partial<AdminSettings>
): Promise<AdminSettings> {
  const client = getClient();
  const result = await client.mutate<{
    updateGlobalSettings: AdminSettings;
  }>(UPDATE_ADMIN_SETTINGS, { input });
  
  return result.updateGlobalSettings;
}
