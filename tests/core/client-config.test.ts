import { DEFAULT_CONFIG } from '../../src/core/config/client-config';

describe('ClientConfig', () => {
  describe('DEFAULT_CONFIG', () => {
    it('should have correct default values', () => {
      expect(DEFAULT_CONFIG).toBeDefined();
      expect(DEFAULT_CONFIG.timeout).toBe(10000);
    });
  });
});
