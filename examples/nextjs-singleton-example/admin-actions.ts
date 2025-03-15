/**
 * This file demonstrates how to use server actions with the Vendure Admin Client in Next.js
 */

'use server'

import { 
  loginAdmin, 
  getProducts, 
  getOrders
} from '@symanticreative/vendure-admin-client';
import { 
  getDashboardStats, 
  getLowStockProducts, 
  cancelOrderWithReason
} from './vendure-client';

/**
 * Authenticate with the Vendure Admin API
 */
export async function authenticate(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  if (!email || !password) {
    return { success: false, message: 'Email and password are required' };
  }
  
  try {
    const authResponse = await loginAdmin({ email, password });
    return { 
      success: true, 
      token: authResponse.token 
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
 * Get dashboard data including custom stats
 */
export async function getDashboardData() {
  try {
    // Get basic product and order data
    const [productsData, ordersData, stats] = await Promise.all([
      getProducts({ take: 5 }),
      getOrders({ take: 5 }),
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
 * Cancel an order with a reason
 */
export async function cancelOrder(orderId: string, reason: string) {
  try {
    const result = await cancelOrderWithReason(orderId, reason);
    return {
      success: true,
      orderState: result.transitionOrderToState.state
    };
  } catch (error) {
    console.error('Error cancelling order:', error);
    return {
      success: false,
      message: 'Failed to cancel order'
    };
  }
}
