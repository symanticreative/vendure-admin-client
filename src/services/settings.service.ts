import { Injectable } from '../core/di/injectable.decorator';
import { SettingsRepository } from '../repositories/settings.repository';
import { AdminSettings, UpdateAdminSettingsInput } from '../models/settings.model';

/**
 * Service for admin settings operations
 */
@Injectable()
export class SettingsService {
  constructor(private settingsRepository: SettingsRepository) {}

  /**
   * Get admin settings
   * @returns Promise resolving to admin settings
   */
  async getSettings(): Promise<AdminSettings> {
    return this.settingsRepository.getSettings();
  }

  /**
   * Update admin settings
   * @param input - Settings update input
   * @returns Promise resolving to updated settings
   */
  async updateSettings(input: UpdateAdminSettingsInput): Promise<AdminSettings> {
    // Add any business logic, validation, or transformations here
    return this.settingsRepository.updateSettings(input);
  }

  /**
   * Get available languages
   * @returns Promise resolving to array of language codes
   */
  async getAvailableLanguages(): Promise<string[]> {
    const settings = await this.getSettings();
    return settings.availableLanguages || [];
  }

  /**
   * Check if inventory tracking is enabled
   * @returns Promise resolving to boolean
   */
  async isInventoryTrackingEnabled(): Promise<boolean> {
    const settings = await this.getSettings();
    return settings.trackInventory || false;
  }

  /**
   * Get out of stock threshold
   * @returns Promise resolving to threshold value
   */
  async getOutOfStockThreshold(): Promise<number> {
    const settings = await this.getSettings();
    return settings.outOfStockThreshold || 0;
  }
}
