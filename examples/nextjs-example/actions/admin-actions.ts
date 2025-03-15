'use server'

import { AuthCredentials } from '../../../src';
import { getVendureClient, getDashboardStats, getLowStockProducts } from '../lib/vendure-client';

/**
 * Authenticate with the Vendure Admin API
 * @param credentials - Authentication credentials
 * @returns Authentication result
 */
export async function authenticate(credentials: AuthCredentials) {
  try {
    const client = getVendureClient();
    const authResponse = await client.auth.login(credentials);
    
    return { 
      success: true, 
      token: authResponse.token,
      user: authResponse.user
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { 
      success: false, 
      message: 'Authentication failed. Please check your credentials.' 
    };
  }
}

/**
 * Get dashboard data including products, orders, and customers
 * @returns Dashboard data
 */
export async function getDashboardData() {
  try {
    const client = getVendureClient();
    
    // Get basic product and order data
    const [productsData, ordersData, stats] = await Promise.all([
      client.products.getPaginated({ take: 5 }),
      client.orders.getPaginated({ take: 5 }),
      getDashboardStats()
    ]);
    
    // Calculate additional metrics
    const totalRevenue = ordersData.items.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalRevenue / (ordersData.items.length || 1);
    
    return {
      recentProducts: productsData.items,
      recentOrders: ordersData.items,
      stats: {
        totalProducts: stats.products.totalItems,
        totalOrders: stats.orders.totalItems,
        totalCustomers: stats.customers.totalItems,
        totalRevenue,
        averageOrderValue
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw new Error('Failed to fetch dashboard data');
  }
}

/**
 * Get products with low stock levels
 * @param threshold - Stock threshold
 * @returns Low stock products
 */
export async function getLowStockInventory(threshold: number = 5) {
  try {
    const result = await getLowStockProducts(threshold);
    return result.products.items;
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    throw new Error('Failed to fetch inventory data');
  }
}

/**
 * Get customers with pagination
 * @param options - Pagination options
 * @returns Paginated customers
 */
export async function getCustomers(options = { take: 10, skip: 0 }) {
  try {
    const client = getVendureClient();
    return client.customers.getPaginated(options);
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw new Error('Failed to fetch customer data');
  }
}

/**
 * Search products by term
 * @param term - Search term
 * @param options - Pagination options
 * @returns Search results
 */
export async function searchProducts(term: string, options = { take: 10, skip: 0 }) {
  try {
    const client = getVendureClient();
    return client.products.searchProducts(term, options);
  } catch (error) {
    console.error('Error searching products:', error);
    throw new Error('Failed to search products');
  }
}

/**
 * Update order status
 * @param orderId - Order ID
 * @param status - New status
 * @returns Update result
 */
export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const client = getVendureClient();
    const updatedOrder = await client.orders.updateOrderStatus({ 
      orderId, 
      status 
    });
    
    return {
      success: true,
      orderState: updatedOrder.state
    };
  } catch (error) {
    console.error('Error updating order status:', error);
    return {
      success: false,
      message: 'Failed to update order status'
    };
  }
}
