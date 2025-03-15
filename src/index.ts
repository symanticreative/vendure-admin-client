// Export client
export { VendureAdminClient } from './client/vendure-admin-client';
export { VendureAdminClientFactory } from './client/vendure-admin-client.factory';

// Export interfaces and types
export * from './models';
export * from './core/config/client-config';

// Export services if needed directly
export * from './services/auth.service';
export * from './services/product.service';
export * from './services/order.service';
export * from './services/customer.service';
export * from './services/settings.service';
