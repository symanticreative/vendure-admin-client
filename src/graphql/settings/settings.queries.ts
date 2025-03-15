/**
 * GraphQL query for getting admin settings
 */
export const GET_ADMIN_SETTINGS = `
  query GetGlobalSettings {
    globalSettings {
      id
      availableLanguages
      trackInventory
      outOfStockThreshold
      serverConfig {
        timeZone
        customFields
      }
    }
  }
`;

/**
 * GraphQL mutation for updating admin settings
 */
export const UPDATE_ADMIN_SETTINGS = `
  mutation UpdateGlobalSettings($input: UpdateGlobalSettingsInput!) {
    updateGlobalSettings(input: $input) {
      id
      availableLanguages
      trackInventory
      outOfStockThreshold
      serverConfig {
        timeZone
        customFields
      }
    }
  }
`;
