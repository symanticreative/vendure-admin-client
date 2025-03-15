# Next.js Singleton Pattern Example for Vendure Admin Client

This example demonstrates how to use the Vendure Admin Client with a singleton pattern in a Next.js application. The singleton pattern ensures that only one instance of the client is created and used throughout the application, making it more efficient and easier to maintain.

## Overview

This pattern consists of three main components:

1. **`vendure-client.ts`**: Initializes and provides access to the singleton client instance. Also contains custom query examples.
2. **`app-initializer.ts`**: Shows how to initialize the client at the application level.
3. **`admin-actions.ts`**: Demonstrates how to use the client in Next.js server actions.

## Usage

### 1. Initialize the Client

First, create a singleton client initialization file in your project:

```ts
// lib/vendure-client.ts
import { VendureAdminClient } from '@symanticreative/vendure-admin-client';

export function getVendureClient(): VendureAdminClient {
  // Initialize only on the server side
  if (typeof window === 'undefined') {
    return VendureAdminClient.getInstance({
      apiUrl: process.env.VENDURE_ADMIN_API_URL!,
      authToken: process.env.VENDURE_ADMIN_AUTH_TOKEN,
    });
  }
  
  return VendureAdminClient.getInstance();
}
```

### 2. Initialize in Application Entry Point

In your Next.js app's entry point, initialize the client:

```ts
// app/layout.tsx
import { getVendureClient } from '@/lib/vendure-client';

// Initialize the client on the server side
if (typeof window === 'undefined') {
  try {
    getVendureClient();
  } catch (error) {
    console.error('Failed to initialize Vendure Admin Client:', error);
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### 3. Create Custom Queries

You can extend the client with your own custom GraphQL queries:

```ts
// lib/vendure-client.ts
import { executeCustomOperation } from '@symanticreative/vendure-admin-client';

export async function getDashboardStats() {
  const customQuery = `
    query DashboardStats {
      products(options: { take: 0 }) {
        totalItems
      }
      orders(options: { take: 0 }) {
        totalItems
      }
    }
  `;
  
  return executeCustomOperation(customQuery);
}
```

### 4. Use in Server Actions

Utilize the client in Next.js server actions:

```ts
// app/actions.ts
'use server'

import { loginAdmin, getProducts } from '@symanticreative/vendure-admin-client';
import { getDashboardStats } from '@/lib/vendure-client';

export async function getDashboardData() {
  try {
    const [productsData, stats] = await Promise.all([
      getProducts({ take: 5 }),
      getDashboardStats()
    ]);
    
    return {
      recentProducts: productsData.items,
      stats: {
        totalProducts: stats.products.totalItems,
        totalOrders: stats.orders.totalItems
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw new Error('Failed to fetch dashboard data');
  }
}
```

## Benefits of the Singleton Pattern

1. **Efficiency**: Only one client instance is created, reducing memory usage.
2. **Consistency**: All components use the same client instance with the same configuration.
3. **Extensibility**: Easy to add custom queries and mutations.
4. **Maintainability**: Configuration is centralized and easier to update.

## Environment Variables

Create a `.env.local` file with your Vendure Admin API credentials:

```
VENDURE_ADMIN_API_URL=https://your-vendure-instance.com/admin-api
VENDURE_ADMIN_EMAIL=admin@example.com
VENDURE_ADMIN_PASSWORD=your-secure-password
```
