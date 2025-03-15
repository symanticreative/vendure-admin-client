# Next.js Example for Vendure Admin Client

This example demonstrates how to use the Vendure Admin Client with a Next.js application. It showcases the service-repository pattern implementation with proper dependency injection.

## Overview

The example consists of:

1. **Client Initialization**: Using the factory to create a client instance
2. **Server Actions**: Interacting with the Vendure Admin API
3. **Components**: Displaying admin data in a dashboard

## Key Files

- `lib/vendure-client.ts`: Client initialization and custom queries
- `actions/admin-actions.ts`: Server actions for API interactions
- `components/Dashboard.tsx`: Dashboard display component
- `components/LoginForm.tsx`: Authentication component
- `app/page.tsx`: Main application page
- `app/layout.tsx`: Application layout with client initialization

## Usage

### 1. Set Up Environment Variables

Create a `.env.local` file:

```
VENDURE_ADMIN_API_URL=https://your-vendure-instance.com/admin-api
VENDURE_ADMIN_EMAIL=admin@example.com
VENDURE_ADMIN_PASSWORD=your-secure-password
```

### 2. Run the Application

```bash
npm install
npm run dev
```

## Key Concepts

### Client Initialization

The client is initialized on the server side in the `layout.tsx` file:

```typescript
// Initialize the client on the server side
if (typeof window === 'undefined') {
  try {
    getVendureClient();
  } catch (error) {
    console.error('Failed to initialize Vendure Admin Client:', error);
  }
}
```

### Server Actions

Server actions are used to interact with the Vendure Admin API:

```typescript
export async function getDashboardData() {
  try {
    const client = getVendureClient();
    
    // Get basic product and order data
    const [productsData, ordersData, stats] = await Promise.all([
      client.products.getPaginated({ take: 5 }),
      client.orders.getPaginated({ take: 5 }),
      getDashboardStats()
    ]);
    
    // ...processing and return
  } catch (error) {
    // Error handling
  }
}
```

### Client Structure

The client follows a service-repository pattern:

- `client.auth`: Authentication service
- `client.products`: Product service
- `client.orders`: Order service
- `client.customers`: Customer service
- `client.settings`: Settings service

Each service is backed by a repository that handles GraphQL operations.

## Benefits of This Architecture

1. **Separation of Concerns**: Services handle business logic, repositories handle data access
2. **Testability**: Components can be tested in isolation
3. **Maintainability**: Clean architecture makes code easier to maintain
4. **Extensibility**: Easy to add new features or custom functionality
