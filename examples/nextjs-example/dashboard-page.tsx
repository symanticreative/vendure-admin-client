// This would be a Next.js page or component
import { useEffect, useState } from 'react';
import { Product, Order, Customer } from '@symanticreative/vendure-admin-client';
import { fetchDashboardData } from './api';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  revenue: number;
}

interface DashboardData {
  recentProducts: Product[];
  recentOrders: Order[];
  recentCustomers: Customer[];
  stats: DashboardStats;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const dashboardData = await fetchDashboardData();
        setData(dashboardData);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data. Please check your API connection.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div className="dashboard">
      <h1>Vendure Admin Dashboard</h1>
      
      <div className="stats-cards">
        <div className="stat-card">
          <h2>Products</h2>
          <p className="stat-value">{data.stats.totalProducts}</p>
        </div>
        <div className="stat-card">
          <h2>Orders</h2>
          <p className="stat-value">{data.stats.totalOrders}</p>
        </div>
        <div className="stat-card">
          <h2>Customers</h2>
          <p className="stat-value">{data.stats.totalCustomers}</p>
        </div>
        <div className="stat-card">
          <h2>Revenue</h2>
          <p className="stat-value">£{data.stats.revenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="recent-data">
        <div className="recent-section">
          <h2>Recent Products</h2>
          <ul>
            {data.recentProducts.map(product => (
              <li key={product.id}>
                {product.name} {product.enabled ? '(Active)' : '(Inactive)'}
              </li>
            ))}
          </ul>
        </div>

        <div className="recent-section">
          <h2>Recent Orders</h2>
          <ul>
            {data.recentOrders.map(order => (
              <li key={order.id}>
                {order.code} - {order.state} - £{order.total}
              </li>
            ))}
          </ul>
        </div>

        <div className="recent-section">
          <h2>Recent Customers</h2>
          <ul>
            {data.recentCustomers.map(customer => (
              <li key={customer.id}>
                {customer.firstName} {customer.lastName} - {customer.email}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
