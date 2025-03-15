import { Container, createServiceToken } from '../../src/core/di/container';

describe('Container', () => {
  // Create a test class
  class TestService {
    getValue(): string {
      return 'test-value';
    }
  }
  
  // Create a test interface and token
  interface ITestService {
    getValue(): string;
  }
  
  beforeEach(() => {
    // Clear container before each test
    Container.getInstance().clear();
  });

  describe('getInstance', () => {
    it('should return the same instance when called multiple times', () => {
      const container1 = Container.getInstance();
      const container2 = Container.getInstance();
      
      expect(container1).toBe(container2);
    });
  });

  describe('register and get', () => {
    it('should register and retrieve a service instance', () => {
      const container = Container.getInstance();
      const testService = new TestService();
      
      container.register('TestService', testService);
      
      const retrievedService = container.get<TestService>('TestService');
      expect(retrievedService).toBe(testService);
      expect(retrievedService.getValue()).toBe('test-value');
    });

    it('should throw an error when getting an unregistered service', () => {
      const container = Container.getInstance();
      
      expect(() => container.get('UnregisteredService')).toThrow('Service not found: UnregisteredService');
    });
  });

  describe('registerFactory', () => {
    it('should register a factory and create a service when requested', () => {
      const container = Container.getInstance();
      const factory = jest.fn().mockReturnValue(new TestService());
      
      container.registerFactory('TestService', factory);
      
      // Factory should not be called until service is requested
      expect(factory).not.toHaveBeenCalled();
      
      const service = container.get<TestService>('TestService');
      
      expect(factory).toHaveBeenCalledTimes(1);
      expect(service).toBeInstanceOf(TestService);
      expect(service.getValue()).toBe('test-value');
      
      // Factory should not be called again on subsequent requests
      const service2 = container.get<TestService>('TestService');
      expect(factory).toHaveBeenCalledTimes(1);
      expect(service2).toBe(service);
    });
  });

  describe('has', () => {
    it('should return true if service is registered', () => {
      const container = Container.getInstance();
      
      container.register('TestService', new TestService());
      
      expect(container.has('TestService')).toBe(true);
      expect(container.has('UnregisteredService')).toBe(false);
    });

    it('should return true if factory is registered', () => {
      const container = Container.getInstance();
      
      container.registerFactory('TestService', () => new TestService());
      
      expect(container.has('TestService')).toBe(true);
    });
  });

  describe('remove', () => {
    it('should remove a registered service', () => {
      const container = Container.getInstance();
      
      container.register('TestService', new TestService());
      expect(container.has('TestService')).toBe(true);
      
      container.remove('TestService');
      expect(container.has('TestService')).toBe(false);
    });

    it('should remove a registered factory', () => {
      const container = Container.getInstance();
      
      container.registerFactory('TestService', () => new TestService());
      expect(container.has('TestService')).toBe(true);
      
      container.remove('TestService');
      expect(container.has('TestService')).toBe(false);
    });
  });

  describe('clear', () => {
    it('should remove all registered services and factories', () => {
      const container = Container.getInstance();
      
      container.register('TestService1', new TestService());
      container.registerFactory('TestService2', () => new TestService());
      
      expect(container.has('TestService1')).toBe(true);
      expect(container.has('TestService2')).toBe(true);
      
      container.clear();
      
      expect(container.has('TestService1')).toBe(false);
      expect(container.has('TestService2')).toBe(false);
    });
  });

  describe('createServiceToken', () => {
    it('should create a typed token', () => {
      const tokenName = 'ITestService';
      const token = createServiceToken<ITestService>(tokenName);
      
      // The token should still be a string
      expect(typeof token).toBe('string');
      expect(token).toBe(tokenName);
    });
  });
});
