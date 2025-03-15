/**
 * Admin settings interface
 */
export interface AdminSettings {
  id: string;
  availableLanguages: string[];
  trackInventory: boolean;
  outOfStockThreshold: number;
  serverConfig: {
    timeZone: string;
    customFields: Record<string, any>;
  };
  [key: string]: any;
}

/**
 * Admin settings update input
 */
export interface UpdateAdminSettingsInput extends Partial<AdminSettings> {
  // Any specific fields for settings update
}
