// Export the main client class
export { VendureAdminClient } from './client/vendure-admin-client';

// Export types
export * from './types';

// Export GraphQL queries and mutations
export * as AuthQueries from './graphql/auth';

// Library version
export const VERSION = '1.0.0';
