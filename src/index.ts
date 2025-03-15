// Core client - This is the main way to initialize the singleton
export { VendureAdminClient } from './client/vendure-admin-client';

// Authentication
export { 
  loginAdmin,
  logoutAdmin,
  getCurrentUser,
  executeCustomOperation // For custom queries
} from './api/auth';

// Products API
export { 
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from './api/products';

// Orders API
export { 
  getOrders,
  getOrder,
  updateOrderStatus
} from './api/orders';

// Customers API
export { 
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer
} from './api/customers';

// Settings API
export { 
  getAdminSettings,
  updateAdminSettings
} from './api/settings';

// Export types
export * from './types';

// Export GraphQL queries and mutations
export * as AuthQueries from './graphql/auth';
export * as ProductQueries from './graphql/products';
export * as OrderQueries from './graphql/orders';
export * as CustomerQueries from './graphql/customers';
export * as SettingQueries from './graphql/settings';

// Library version
export const VERSION = '1.0.0';
