/**
 * Simple dependency injection container
 * Manages service instances and dependencies
 */
export class Container {
  private static instance: Container;
  private services: Map<string, any> = new Map();
  private factories: Map<string, () => any> = new Map();

  /**
   * Get the singleton instance of the container
   */
  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  /**
   * Register a service instance
   * @param token - Service identifier/token
   * @param instance - Service instance
   */
  public register<T>(token: string, instance: T): void {
    this.services.set(token, instance);
  }

  /**
   * Register a factory function to create a service
   * @param token - Service identifier/token
   * @param factory - Factory function to create the service
   */
  public registerFactory<T>(token: string, factory: () => T): void {
    this.factories.set(token, factory);
  }

  /**
   * Get a service instance
   * If not found, attempts to create it using registered factory
   * @param token - Service identifier/token
   */
  public get<T>(token: string): T {
    if (this.services.has(token)) {
      return this.services.get(token) as T;
    }

    if (this.factories.has(token)) {
      const factory = this.factories.get(token);
      const instance = factory!();
      this.services.set(token, instance);
      return instance as T;
    }

    throw new Error(`Service not found: ${token}`);
  }

  /**
   * Check if a service is registered
   * @param token - Service identifier/token
   */
  public has(token: string): boolean {
    return this.services.has(token) || this.factories.has(token);
  }

  /**
   * Remove a service instance
   * @param token - Service identifier/token
   */
  public remove(token: string): void {
    this.services.delete(token);
    this.factories.delete(token);
  }

  /**
   * Clear all registered services
   */
  public clear(): void {
    this.services.clear();
    this.factories.clear();
  }
}

/**
 * Type for service tokens to prevent magic strings
 */
export type ServiceToken<T> = string & { __type: T };

/**
 * Create a typed service token
 * @param name - Token name
 */
export function createServiceToken<T>(name: string): ServiceToken<T> {
  return name as ServiceToken<T>;
}
