# Vendure Admin Client Singleton Implementation

## Overview

I've streamlined the Vendure Admin Client to use a cleaner singleton pattern, allowing for easier integration with Next.js applications. This implementation ensures only one client instance exists throughout the application and provides a clean way to extend the client with custom GraphQL queries.

## Changes Made

### 1. Simplified Singleton Pattern

The `VendureAdminClient` is now the single point of initialization:
- Used a true singleton pattern with private constructor and static instance
- Direct initialization through `VendureAdminClient.getInstance(config)`
- Removed duplicate initialization methods for a cleaner API
- Maintained the singleton pattern for consistent configuration

### 2. Removed Redundant Initialization Methods

- Removed `setAdminCredentials()` and `initializeAdminClient()` functions
- All initialization now happens directly through `VendureAdminClient.getInstance()`
- This simplifies the API and removes confusion about which method to use

### 3. Custom Query Support

Maintained support for custom GraphQL operations:
- Kept the `executeCustomOperation()` method for arbitrary GraphQL queries/mutations
- Simplified the approach to custom queries

### 4. Next.js Integration Example

Updated the Next.js example to demonstrate:
- Direct initialization through `VendureAdminClient.getInstance()`
- Creating and using custom GraphQL queries
- Using the client in Next.js server actions

## File Changes

1. **src/client/vendure-admin-client.ts**
   - Maintained the singleton implementation with private constructor
   - Kept the direct initialization through `getInstance()`

2. **src/api/auth.ts**
   - Removed redundant initialization methods
   - Simplified to only use the VendureAdminClient singleton

3. **src/index.ts**
   - Updated exports to remove duplicate initialization methods
   - Added clearer comments about using the singleton

4. **examples/nextjs-singleton-example/**
   - Updated examples to use direct VendureAdminClient initialization
   - Updated README with clearer instructions

## Benefits

This simplified implementation offers several advantages:

1. **Single Initialization Method**: One clear way to initialize the client
2. **Host Project Control**: Configuration fully defined in the host project
3. **Clean API**: No redundant methods causing confusion
4. **Consistent Client**: One shared client instance throughout the application

## Usage Example

```typescript
// Initialize in your application
import { VendureAdminClient } from '@symanticreative/vendure-admin-client';

// Initialize the singleton with your config
VendureAdminClient.getInstance({
  apiUrl: process.env.VENDURE_ADMIN_API_URL,
});

// Use anywhere in your application
import { 
  getProducts, 
  executeCustomOperation 
} from '@symanticreative/vendure-admin-client';

// Use built-in methods
const products = await getProducts({ take: 10 });

// Or execute custom queries
const customData = await executeCustomOperation(`
  query CustomData {
    products(options: { filter: { ... } }) {
      items {
        id
        name
        customFields {
          myCustomField
        }
      }
    }
  }
`);
```

This simplified implementation makes the client more intuitive to use while maintaining all existing functionality.
