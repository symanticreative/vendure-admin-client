# Vendure Admin Client

A TypeScript GraphQL client for the Vendure Admin API, implemented with a service-repository pattern and dependency injection.

## Architecture

This client follows a clean architecture with clear separation of concerns:

1. **Service Layer**: Business logic and high-level operations
2. **Repository Layer**: Data access and GraphQL operations
3. **Client Layer**: The main entry point that integrates everything
4. **Core**: Shared infrastructure, interfaces, and utilities
5. **Models**: Data structures and DTOs

## Key Features

- **TypeScript-first** with strong typing throughout
- **Service-Repository Pattern** for clean separation of concerns
- **Dependency Injection** for better testability and flexibility
- **GraphQL-powered** using Apollo Client
- **Domain-driven Design** with separate modules for different entities
- **Next.js Integration** with examples for server-side usage

## Usage

### Installation

```bash
npm install @symanticreative/vendure-admin-client
```

### Basic Usage

```typescript
import { 
  VendureAdminClientFactory, 
  VendureAdminClient 
} from '@symanticreative/vendure-admin-client';

// Create a client instance
const client = VendureAdminClientFactory.createClient({
  apiUrl: 'https://your-vendure-instance.com/admin-api',
});

// Login using the auth service
await client.auth.login({
  email: 'admin@example.com',
  password: 'password',
});

// Get products using the product service
const products = await client.products.getPaginated({ take: 10 });

// Use the order service
const orders = await client.orders.getPaginated({ take: 5 });

// Use the customer service
const customers = await client.customers.getPaginated({ take: 10 });

// Use the settings service
const settings = await client.settings.getSettings();
```

## Architecture Details

### Service Layer

Services handle business logic and provide a high-level API for common operations:

- `AuthService`: Authentication operations
- `ProductService`: Product management
- `OrderService`: Order processing
- `CustomerService`: Customer management
- `SettingsService`: Admin settings

### Repository Layer

Repositories handle data access and GraphQL operations:

- `AuthRepository`: Authentication operations
- `ProductRepository`: Product data access
- `OrderRepository`: Order data access
- `CustomerRepository`: Customer data access
- `SettingsRepository`: Settings data access

### Dependency Injection

The client uses a simple dependency injection container for managing dependencies:

```typescript
const container = Container.getInstance();
container.register('ProductService', new ProductService(productRepository));
const productService = container.get<ProductService>('ProductService');
```

### GraphQL Client

A GraphQL client service handles all GraphQL operations:

```typescript
const graphqlClient = new GraphQLClientService(config);
const result = await graphqlClient.query(GET_PRODUCTS, { options });
```

## Next.js Integration

For Next.js applications, the client can be initialized in the app's entry point:

```typescript
// app/layout.tsx
import { getVendureClient } from '@/lib/vendure-client';

// Initialize the client on the server side
if (typeof window === 'undefined') {
  getVendureClient();
}

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

And then used in server actions:

```typescript
// actions.ts
'use server'

import { getVendureClient } from '@/lib/vendure-client';

export async function getDashboardData() {
  const client = getVendureClient();
  return client.products.getPaginated({ take: 5 });
}
```

## Examples

The package includes examples:

- `examples/basic-usage.ts`: Simple usage example
- `examples/nextjs-example/`: Complete Next.js application example

## License

MIT License
