/**
 * Decorator to mark a class as injectable
 * This is used for dependency injection
 */
export function Injectable() {
  return function<T extends new (...args: any[]) => any>(constructor: T) {
    // This is a simple implementation
    // In a more complex DI system, this would attach metadata to the class
    return constructor;
  };
}
