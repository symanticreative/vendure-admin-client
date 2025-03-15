import { SettingsService } from '../../src/services/settings.service';
import { SettingsRepository } from '../../src/repositories/settings.repository';
import { AdminSettings, UpdateAdminSettingsInput } from '../../src/models/settings.model';

// Mock the SettingsRepository
jest.mock('../../src/repositories/settings.repository');

describe('SettingsService', () => {
  let settingsService: SettingsService;
  let mockSettingsRepository: jest.Mocked<SettingsRepository>;

  const mockSettings: AdminSettings = {
    id: 'settings-1',
    availableLanguages: ['en', 'fr', 'de'],
    trackInventory: true,
    outOfStockThreshold: 5,
    serverConfig: {
      timeZone: 'Europe/London',
      customFields: {
        allowGuestCheckout: true
      }
    }
  };

  const mockUpdateInput: UpdateAdminSettingsInput = {
    trackInventory: false,
    outOfStockThreshold: 10
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Create a fresh mock repository
    mockSettingsRepository = {
      getSettings: jest.fn().mockResolvedValue(mockSettings),
      updateSettings: jest.fn().mockResolvedValue({
        ...mockSettings,
        ...mockUpdateInput
      })
    } as unknown as jest.Mocked<SettingsRepository>;
    
    // Initialize the service with the mock repository
    settingsService = new SettingsService(mockSettingsRepository);
  });

  describe('getSettings', () => {
    it('should call repository getSettings', async () => {
      const result = await settingsService.getSettings();
      
      expect(mockSettingsRepository.getSettings).toHaveBeenCalled();
      expect(result).toEqual(mockSettings);
    });
  });

  describe('updateSettings', () => {
    it('should call repository updateSettings with input', async () => {
      const result = await settingsService.updateSettings(mockUpdateInput);
      
      expect(mockSettingsRepository.updateSettings).toHaveBeenCalledWith(mockUpdateInput);
      expect(result).toEqual({
        ...mockSettings,
        ...mockUpdateInput
      });
    });
  });

  describe('getAvailableLanguages', () => {
    it('should return languages from settings', async () => {
      const result = await settingsService.getAvailableLanguages();
      
      expect(mockSettingsRepository.getSettings).toHaveBeenCalled();
      expect(result).toEqual(mockSettings.availableLanguages);
    });
  });

  describe('isInventoryTrackingEnabled', () => {
    it('should return trackInventory value from settings', async () => {
      const result = await settingsService.isInventoryTrackingEnabled();
      
      expect(mockSettingsRepository.getSettings).toHaveBeenCalled();
      expect(result).toEqual(mockSettings.trackInventory);
    });
  });

  describe('getOutOfStockThreshold', () => {
    it('should return outOfStockThreshold value from settings', async () => {
      const result = await settingsService.getOutOfStockThreshold();
      
      expect(mockSettingsRepository.getSettings).toHaveBeenCalled();
      expect(result).toEqual(mockSettings.outOfStockThreshold);
    });
  });
});
