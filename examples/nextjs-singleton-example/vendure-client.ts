/**
 * This file demonstrates how to set up a singleton client for a Next.js application.
 * It can be imported and used throughout the application to access the Vendure Admin API.
 */
import { 
  VendureAdminClient, 
  executeCustomOperation 
} from '@symanticreative/vendure-admin-client';

// Initialize the client as a singleton
export function getVendureClient(): VendureAdminClient {
  // Only initialize on the server side
  if (typeof window === 'undefined') {
    return VendureAdminClient.getInstance({
      apiUrl: process.env.VENDURE_ADMIN_API_URL || 'https://demo.vendure.io/admin-api',
      authToken: process.env.VENDURE_ADMIN_AUTH_TOKEN,
      refreshToken: process.env.VENDURE_ADMIN_REFRESH_TOKEN,
    });
  }
  
  // Return the singleton instance (will throw an error if not initialized)
  return VendureAdminClient.getInstance();
}

// Example of a custom query function
export async function getDashboardStats() {
  const customQuery = `
    query DashboardStats {
      products(options: { take: 0 }) {
        totalItems
      }
      orders(options: { take: 0 }) {
        totalItems
      }
      customers(options: { take: 0 }) {
        totalItems
      }
    }
  `;
  
  return executeCustomOperation<{
    products: { totalItems: number };
    orders: { totalItems: number };
    customers: { totalItems: number };
  }>(customQuery);
}

// Example of a custom inventory query
export async function getLowStockProducts(threshold: number = 10) {
  const customQuery = `
    query LowStockProducts($threshold: Int!) {
      products(options: { 
        filter: { 
          variants: { stockOnHand: { lt: $threshold } }
        },
        take: 50
      }) {
        items {
          id
          name
          variants {
            id
            name
            sku
            stockOnHand
          }
        }
      }
    }
  `;
  
  return executeCustomOperation(customQuery, { threshold });
}

// Example of a custom order mutation
export async function cancelOrderWithReason(orderId: string, reason: string) {
  const customMutation = `
    mutation CancelOrderWithReason($orderId: ID!, $reason: String!) {
      addNoteToOrder(input: {
        id: $orderId,
        note: $reason,
        isPrivate: true
      }) {
        id
      }
      transitionOrderToState(id: $orderId, state: "Cancelled") {
        id
        state
      }
    }
  `;
  
  return executeCustomOperation(
    customMutation, 
    { orderId, reason },
    { type: 'mutation' }
  );
}
