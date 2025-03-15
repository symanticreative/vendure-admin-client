# Vendure Admin Client

A TypeScript package to interact with a Vendure admin API instance for creating custom dashboards.

## Installation

```bash
npm install vendure-admin
```

## Usage

```typescript
import { VendureAdminClient } from 'vendure-admin';

// Initialize the client
const client = new VendureAdminClient({
  apiUrl: 'https://your-vendure-instance.com/admin-api',
});

// Authenticate
async function authenticate() {
  try {
    await client.login('admin', 'password');
    console.log('Authenticated successfully');
  } catch (error) {
    console.error('Authentication failed', error);
  }
}

// Execute a query
async function fetchProducts() {
  try {
    const result = await client.query(`
      query {
        products(options: { take: 10 }) {
          items {
            id
            name
            slug
          }
          totalItems
        }
      }
    `);
    console.log('Products:', result);
  } catch (error) {
    console.error('Failed to fetch products', error);
  }
}

// Execute a mutation
async function createProduct() {
  try {
    const result = await client.mutate(`
      mutation CreateProduct($input: CreateProductInput!) {
        createProduct(input: $input) {
          id
          name
        }
      }
    `, {
      input: {
        name: 'New Product',
        slug: 'new-product',
      }
    });
    console.log('Product created:', result);
  } catch (error) {
    console.error('Failed to create product', error);
  }
}
```

## API

### VendureAdminClient

#### Constructor

```typescript
constructor(config: VendureAdminClientConfig)
```

#### Methods

- `login(username: string, password: string): Promise<AuthResponse>`
- `logout(): void`
- `query<T>(query: string, variables?: Record<string, any>): Promise<T>`
- `mutate<T>(mutation: string, variables?: Record<string, any>): Promise<T>`
- `getAuthToken(): string | null`
- `setAuthToken(token: string): void`
- `isAuthenticated(): boolean`

## License

ISC
