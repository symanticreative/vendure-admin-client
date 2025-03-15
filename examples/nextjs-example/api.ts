import { 
  setAdminCredentials, 
  loginAdmin, 
  getProducts, 
  getOrders, 
  getCustomers 
} from '@symanticreative/vendure-admin-client';

// This would typically be in a Next.js api route or server component
export async function initializeVendureClient() {
  // Initialize with environment variables
  setAdminCredentials({
    apiUrl: process.env.VENDURE_ADMIN_API_URL || 'https://demo.vendure.io/admin-api',
  });
}

export async function authenticateAdmin(email: string, password: string) {
  return loginAdmin({ email, password });
}

export async function fetchDashboardData() {
  try {
    // Fetch data for dashboard
    const [products, orders, customers] = await Promise.all([
      getProducts({ take: 5 }),
      getOrders({ take: 5 }),
      getCustomers({ take: 5 })
    ]);

    return {
      recentProducts: products.items,
      recentOrders: orders.items,
      recentCustomers: customers.items,
      stats: {
        totalProducts: products.totalItems,
        totalOrders: orders.totalItems,
        totalCustomers: customers.totalItems,
        // You could calculate revenue here based on orders
        revenue: orders.items.reduce((sum, order) => sum + order.total, 0)
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}
